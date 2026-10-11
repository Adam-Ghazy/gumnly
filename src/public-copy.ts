// Translate only the original seed values. Administrator edits remain authoritative.
const defaults: Record<string, string> = {
  'Membangun software yang membuat pekerjaan lebih sederhana.': 'SaaS products. Services that deliver.',
  'GUMNLY mengembangkan produk SaaS dan solusi software khusus untuk membantu bisnis mengelola proses kerja dengan lebih terstruktur.': 'Gumnly is a technology startup building SaaS products and delivering digital services that help customers solve real business challenges.',
  'GUMNLY adalah startup teknologi SaaS-first yang mengembangkan produk digital sendiri.': 'GUMNLY is a technology startup developing its own SaaS products.',
  'Pengembangan software khusus, otomasi alur kerja, dan integrasi sistem untuk proyek terpilih.': 'Custom software, workflow automation, and system integration for selected projects.',
  'Produk SaaS pertama sedang dikembangkan. Nama dan lingkup produk belum final.': 'Our first SaaS product is in development. Its name and scope are not final.',
  'Nama, email, jenis minat, dan pesan disimpan secara lokal untuk menindaklanjuti pertanyaan. Jika email dikonfigurasi, data juga dikirim ke penyedia email dan penerima yang ditentukan pengelola. Penghapusan dilakukan oleh admin. Kebijakan retensi dan kontak privasi harus disetujui sebelum peluncuran publik.': 'Your name, email, enquiry type, and message are stored on our server so we can respond. If email delivery is configured, this data is also sent to the email provider and the recipient set by the administrator. Administrators handle deletion. Retention periods and a privacy contact still need to be agreed before public launch.',
};
export function publicCopy(value: string): string { return defaults[value] ?? value; }
