/** Sayt matnlari: bosh sahifa va alohida sahifalar bir xil manbadan oladi. */
export const FEATURES = [
  ["✉", "Ochilish marosimi", "Mehmon avval yopiq konvert, muhr yoki yurakni ko‘radi va o‘zi ochadi."],
  ["▦", "Taqvim va sanoq", "To‘y kuni taqvimda belgilanadi, kun, soat, daqiqa va soniya sanab turadi."],
  ["☰", "To‘y dasturi", "Kutib olish, nikoh, ziyofat: har bir bosqichning vaqti chiroyli chiziqda."],
  ["⌖", "Xaritada yo‘nalish", "Manzil ustiga bosilganda xarita ochiladi, adashib qolish yo‘q."],
  ["✓", "Kelaman / kelmayman", "Mehmon javobini va necha kishi kelishini yuboradi, siz hammasini ro‘yxatda ko‘rasiz."],
  ["♫", "Musiqa", "Dizaynga mos kuy konvert ochilganda o‘zi boshlanadi, pastdagi tugma bilan o‘chiriladi."],
  ["❀", "Foto galereya", "Juftlik rasmlari chiroyli ramkada, 6 tagacha surat."],
  ["✎", "Tilaklar kitobi", "Mehmonlar tilak yozadi, siz ularni bir joyda o‘qiysiz."],
  ["◎", "Mehmonga shaxsiy havola", "Har mehmonga ismi yozilgan alohida havola, QR-kod bilan."],
  ["文", "O‘zbek va rus tillari", "Taklifnoma ikki tilda ochiladi, mehmon tilni o‘zi tanlaydi."],
  ["⊕", "Taqvimga qo‘shish", "Bir bosishda to‘y mehmonning telefon taqvimiga tushadi."],
  ["❖", "Ota-ona nomidan", "Kiyim kodi va ota-ona taklif matni uchun alohida joy."],
] as const;

export const STEPS = [
  ["Shablonni tanlang", "O‘n beshta dizayndan o‘zingizga yoqqanini tanlang: konvert, muhr, yurak yoki darvoza."],
  ["Ma’lumotlarni kiriting", "Ismlar, sana, dastur, manzil va juftlik rasmi. O‘ng tomonda taklifnoma o‘sha zahoti o‘zgaradi."],
  ["Havolani yuboring", "Saqlang va tayyor havolani WhatsApp yoki Telegram orqali mehmonlarga jo‘nating."],
] as const;

export const FAQ = [
  ["Taklifnomani ro‘yxatdan o‘tmasdan yaratsam bo‘ladimi?", "Ha. Tahrirlash uchun alohida maxfiy havola beriladi, ommaviy havola orqali taklifnomani o‘zgartirib bo‘lmaydi."],
  ["Mehmonlar taklifnomani qanday ochadi?", "Nashr qilingach beriladigan noyob havola orqali: ilova o‘rnatish shart emas. Avval konvert (yoki muhr, yurak) ko‘rinadi, bosilganda taklifnoma ochiladi."],
  ["Yaratgandan keyin o‘zgartirsam bo‘ladimi?", "Ha. Maxfiy tahrirlash havolasi orqali ismlar, sana, dastur va dizaynni istalgan vaqt o‘zgartirasiz, havola o‘zgarmaydi."],
  ["Musiqa qanday ishlaydi?", "Har dizaynga mos kuy bor. Mehmon konvertni ochganda u boshlanadi, pastdagi tugma bilan to‘xtatiladi va yana yoqiladi."],
  ["Mehmonlarning javobini qayerda ko‘raman?", "Maxfiy tahrirlash sahifangizda: kim keladi, necha kishi, qanday tilak yozgan, hammasi ro‘yxatda."],
  ["Har mehmonga alohida havola bo‘ladimi?", "Ha. Havolaga mehmon ismini qo‘shib yuborsangiz, taklifnomada unga nom bilan murojaat qilinadi. QR-kod ham beriladi."],
  ["Rus tilida ham bo‘ladimi?", "Ha. Havola oxiriga rus tili belgisini qo‘shsangiz, taklifnoma ruscha ochiladi."],
  ["Taklifnoma narxi qancha?", "Hozircha yaratish va nashr qilish uchun to‘lov talab qilinmaydi."],
] as const;

export const NAV = [
  ["/dizaynlar", "Dizaynlar"],
  ["/imkoniyatlar", "Imkoniyatlar"],
  ["/savollar", "Savollar"],
] as const;
