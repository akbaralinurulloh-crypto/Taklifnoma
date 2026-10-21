#!/usr/bin/env python3
"""Taklifnoma uchun 10 ta original instrumental treki sintez qiladi (numpy/scipy + ffmpeg).
Hech qanday tashqi audio, sample yoki litsenziyali asar ishlatilmaydi: barchasi shu skriptda hisoblanadi."""
import subprocess, sys, os
import numpy as np
from scipy.signal import fftconvolve, butter, lfilter

SR = 44100
rng = np.random.default_rng(7)
OUT = sys.argv[1] if len(sys.argv) > 1 else "public/music"
os.makedirs(OUT, exist_ok=True)

def hz(m): return 440.0 * 2 ** ((m - 69) / 12)
def env(n, a, d, s=0.0, r=0.0):
    t = np.arange(n) / SR
    e = np.minimum(t / max(a, 1e-4), 1.0) * np.exp(-t / d)
    if r: e *= np.clip((n / SR - t) / r, 0, 1)
    return e
def lp(x, fc, order=2):
    b, a = butter(order, fc / (SR / 2)); return lfilter(b, a, x)

def pluck(m, dur, bright=6, decay=0.9, inh=0.0):
    n = int(dur * SR); t = np.arange(n) / SR; f = hz(m); y = np.zeros(n)
    for k in range(1, bright + 1):
        y += np.sin(2 * np.pi * f * k * (1 + inh * k * k) * t) * (1 / k ** 1.3) * np.exp(-t * k * 0.9 / decay)
    y *= np.minimum(t / 0.004, 1); return y
def bell(m, dur, ratio=3.5, idx=2.5, decay=1.6):
    n = int(dur * SR); t = np.arange(n) / SR; f = hz(m)
    mod = np.sin(2 * np.pi * f * ratio * t) * idx * np.exp(-t / (decay * 0.5))
    return np.sin(2 * np.pi * f * t + mod) * np.exp(-t / decay) * np.minimum(t / 0.003, 1)
def piano(m, dur, decay=1.4):
    n = int(dur * SR); t = np.arange(n) / SR; f = hz(m); y = np.zeros(n)
    for k, a in enumerate([1, .5, .3, .18, .1, .06], 1):
        y += a * np.sin(2 * np.pi * f * k * (1 + 0.0004 * k * k) * t) * np.exp(-t * (0.8 + k * 0.7) / decay)
    return y * np.minimum(t / 0.003, 1)
def pad(ms, dur, bright=900):
    n = int(dur * SR); t = np.arange(n) / SR; y = np.zeros(n)
    for m in ms:
        for dt in (-0.07, 0.0, 0.08):
            f = hz(m + dt); ph = rng.random() * 6.28
            for k in range(1, 7): y += np.sin(2 * np.pi * f * k * t + ph) / k ** 1.4
    y = lp(y, bright); e = np.minimum(t / (dur * 0.35), 1) * np.clip((dur - t) / (dur * 0.45), 0, 1)
    return y * e / max(len(ms), 1)
def string(m, dur):
    n = int(dur * SR); t = np.arange(n) / SR; f = hz(m); y = np.zeros(n)
    vib = 1 + 0.003 * np.sin(2 * np.pi * 5.2 * t) * np.minimum(t / 0.5, 1)
    for dt in (-0.06, 0.06):
        ff = f * 2 ** (dt / 12)
        for k in range(1, 9): y += np.sin(2 * np.pi * ff * k * t * vib) / k ** 1.2
    y = lp(y, 2400)
    return y * np.minimum(t / 0.25, 1) * np.clip((dur - t) / 0.35, 0, 1)
def kick(dur=0.25):
    n = int(dur * SR); t = np.arange(n) / SR
    return np.sin(2 * np.pi * (50 + 90 * np.exp(-t * 30)) * t) * np.exp(-t * 14)
def doira(dur=0.18, hi=False):
    n = int(dur * SR); t = np.arange(n) / SR; nz = rng.standard_normal(n)
    nz = lp(nz, 5000) if hi else lp(nz, 1800)
    return (nz * np.exp(-t * (38 if hi else 22)) + np.sin(2 * np.pi * (200 if hi else 140) * t) * np.exp(-t * 25) * .5)

def reverb(x, sec=2.2, wet=0.25):
    n = int(sec * SR); ir = rng.standard_normal(n) * np.exp(-np.arange(n) / (sec * SR / 4.5)); ir = lp(ir, 5000)
    ir /= np.abs(ir).sum() ** 0.5 + 1e-9
    w = fftconvolve(x, ir)[: len(x)]; w /= (np.abs(w).max() + 1e-9) / (np.abs(x).max() + 1e-9)
    return x * (1 - wet) + w * wet

class Track:
    def __init__(s, dur): s.n = int(dur * SR); s.L = np.zeros(s.n); s.R = np.zeros(s.n)
    def put(s, snd, t0, g=1.0, pan=0.0):
        i = int(t0 * SR)
        if i >= s.n: return
        seg = snd[: s.n - i]
        s.L[i:i + len(seg)] += seg * g * (1 - max(pan, 0)); s.R[i:i + len(seg)] += seg * g * (1 + min(pan, 0))
    def render(s, name, wet=0.25, rv=2.2):
        L, R = reverb(s.L, rv, wet), reverb(s.R, rv * 1.1, wet)
        y = np.stack([L, R], 1); y /= np.abs(y).max() + 1e-9; y *= 0.8
        n = len(y); f = int(2.5 * SR)
        y[:f] *= np.linspace(0, 1, f)[:, None]; y[-f:] *= np.linspace(1, 0, f)[:, None]
        raw = (y * 32767).astype(np.int16).tobytes()
        subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-f", "s16le", "-ar", str(SR), "-ac", "2", "-i", "-",
                        "-codec:a", "libmp3lame", "-b:a", "128k", os.path.join(OUT, name)], input=raw, check=True)
        print(name, round(n / SR), "s")

DUR = 64
MAJ, MIN = [0, 2, 4, 5, 7, 9, 11], [0, 2, 3, 5, 7, 8, 10]
PHR = [0, 1, 4, 5, 7, 8, 10]  # frigiy dominant (sharq ohangi)
def scale_note(root, sc, deg): return root + sc[deg % 7] + 12 * (deg // 7)

def arp_track(name, root, sc, prog, bpm, inst, pat, g=0.5, bass=None, pads=None, wet=0.3, rv=2.4, swing=0.0, melody=None):
    T = Track(DUR); beat = 60 / bpm; bar = 4 * beat; nb = int(DUR / bar)
    for b in range(nb):
        ch = prog[b % len(prog)]; chord = [scale_note(root, sc, ch + o) for o in (0, 2, 4, 7)]
        t0 = b * bar
        if pads: T.put(pad([c for c in chord[:3]], bar * 1.2, pads), t0, 0.35)
        if bass: T.put(bass(chord[0] - 12, bar * 0.95), t0, 0.5)
        for i, p in enumerate(pat):
            tt = t0 + i * beat / 2 + (swing * beat / 2 if i % 2 else 0)
            T.put(inst(chord[p % 4] + 12 * (p // 4), beat * 2.2), tt, g, pan=(-.3 if i % 2 else .3))
        if melody and b % 2 == 1:
            for j, (d, o) in enumerate(melody[(b // 2) % len(melody)]):
                T.put(inst(scale_note(root, sc, d) + 12, beat * 1.6), t0 + o * beat, g * 1.1, pan=0.1)
    return T

tracks = []
# 1 Anor: iliq, minor, pluck (dutar-ga yaqin)
T = arp_track("", 57, MIN, [0, 5, 3, 4], 84, lambda m, d: pluck(m, d, 7, 0.8), [0, 1, 2, 3, 2, 1, 2, 1], g=.45,
              bass=lambda m, d: piano(m, d, 2.0), pads=700, melody=[[(4, 0), (5, 1), (4, 2)], [(2, 0), (3, 1.5), (1, 2.5)]], swing=.08)
T.render("anor.mp3", .3)
# 2 Osmon: yengil, major, qo'ng'iroqcha
T = arp_track("", 62, MAJ, [0, 4, 5, 3], 96, lambda m, d: bell(m, d, 3.5, 1.4, 1.8), [0, 1, 2, 3, 2, 1, 3, 2], g=.38, pads=1100,
              melody=[[(7, 0), (6, 1), (4, 2)], [(5, 0), (6, 1.5), (4, 3)]])
T.render("osmon.mp3", .42, 3.0)
# 3 Zarrin: vals 3/4, torlar
T = Track(DUR); bpm = 150; beat = 60 / bpm; bar = 3 * beat; prog = [0, 3, 4, 0, 5, 3, 4, 0]
for b in range(int(DUR / bar)):
    ch = prog[b % len(prog)]; chord = [scale_note(60, MAJ, ch + o) for o in (0, 2, 4)]; t0 = b * bar
    T.put(piano(chord[0] - 24, bar, 1.6), t0, .55); T.put(string(chord[0] - 12, bar * 1.05), t0, .18)
    for k in (1, 2): T.put(pluck(chord[k] - 12, beat * 1.5, 5, .5), t0 + k * beat, .35, pan=.2)
    if b % 2 == 0:
        T.put(string(scale_note(60, MAJ, ch + [4, 2, 5, 4][(b // 2) % 4]) + 12, bar * 2.1), t0, .35)
T.render("zarrin.mp3", .35, 2.8)
# 4 Oqqora: sekin fortepiano, past pad
T = arp_track("", 52, MIN, [0, 5, 2, 6], 60, lambda m, d: piano(m, d, 2.6), [0, 2, 1, 3, 2, 1, 3, 2], g=.5, pads=500,
              bass=lambda m, d: piano(m - 0, d, 3.0), melody=[[(9, 0), (8, 2), (7, 3)], [(6, 0), (7, 1.5), (4, 3)]], wet=.38, rv=3.2)
T.render("oqqora.mp3", .38, 3.2)
# 5 Zaytun: akustik gitara arpeggio
T = arp_track("", 55, MAJ, [0, 4, 5, 3], 100, lambda m, d: pluck(m, d, 9, .6, 0.00002), [0, 1, 2, 3, 2, 1, 2, 3], g=.5,
              bass=lambda m, d: pluck(m, d * 1.2, 4, 1.0), wet=.2, rv=1.6, melody=[[(7, 0), (9, 1), (8, 2)], [(6, 0), (4, 2), (5, 3)]])
T.render("zaytun.mp3", .2, 1.6)
# 6 Shokolad: iliq elektro-piano, sekin
T = arp_track("", 53, MAJ, [1, 4, 0, 5], 72, lambda m, d: bell(m, d, 1.0, 0.8, 2.2), [0, 2, 1, 3, 1, 2, 3, 1], g=.42, pads=800,
              bass=lambda m, d: piano(m, d, 2.2), swing=.25, melody=[[(8, 0), (9, 1.5), (7, 3)], [(6, 0), (7, 2), (5, 3)]], wet=.3)
T.render("shokolad.mp3", .3, 2.4)
# 7 Gulchizma: musiqa qutisi
T = arp_track("", 72, MAJ, [0, 5, 3, 4], 110, lambda m, d: bell(m, d, 4.0, 0.9, 1.0), [0, 1, 2, 3, 4, 3, 2, 1], g=.33, wet=.35, rv=2.6,
              melody=[[(9, 0), (11, 1), (10, 2)], [(8, 0), (9, 1), (7, 3)]])
T.render("gulchizma.mp3", .35, 2.6)
# 8 Muhr: arfa, sekin
T = arp_track("", 48, MAJ, [0, 2, 3, 4], 66, lambda m, d: pluck(m, d * 1.6, 5, 1.8), [0, 1, 2, 3, 4, 5, 3, 2], g=.42, pads=600, wet=.42, rv=3.4,
              melody=[[(8, 0), (7, 2), (9, 3)], [(6, 0), (5, 2), (4, 3)]])
T.render("muhr.mp3", .42, 3.4)
# 9 Firuza: sharqona (frigiy dominant), burdon + rubob
T = Track(DUR); bpm = 76; beat = 60 / bpm; bar = 4 * beat; root = 50
T.put(pad([root - 12, root - 5], DUR, 400), 0, .5)
mel = [0, 1, 2, 1, 0, -1, 0, 0, 2, 3, 2, 1, 0, 1, 0, 0]
for b in range(int(DUR / bar)):
    t0 = b * bar
    for i in range(8):
        d = mel[(b * 8 + i) % len(mel)] + (4 if b % 4 >= 2 else 0)
        T.put(pluck(scale_note(root + 12, PHR, d), beat * 1.4, 8, .7), t0 + i * beat / 2 * (1 if i % 2 == 0 else 1) , .42, pan=-.2 if i % 2 else .2)
    for k in (0, 2): T.put(doira(), t0 + k * beat, .22); 
    for k in (1, 3): T.put(doira(hi=True), t0 + k * beat, .16)
T.render("firuza.mp3", .3, 2.2)
# 10 Atlas: tez, bayramona, doira bilan
T = Track(DUR); bpm = 120; beat = 60 / bpm; bar = 4 * beat; root = 62
prog = [0, 0, 3, 4]
for b in range(int(DUR / bar)):
    t0 = b * bar; ch = prog[b % 4]; chord = [scale_note(root, MAJ, ch + o) for o in (0, 2, 4)]
    T.put(pad(chord, bar * 1.1, 1500), t0, .3)
    for i in range(8):
        T.put(pluck(chord[[0, 1, 2, 1][i % 4]] + (12 if i % 2 else 0), beat * .9, 7, .5), t0 + i * beat / 2, .42, pan=.25 if i % 2 else -.25)
    for k in range(4): T.put(doira(), t0 + k * beat, .24); T.put(doira(hi=True), t0 + k * beat + beat / 2, .14)
    T.put(kick(), t0, .3)
T.render("atlas.mp3", .22, 1.8)
