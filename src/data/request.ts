export const questions = [
  {
    label: 'Siapa nama Anda?',
    id: 'name',
    column: 'Nama',
    type: 'text',
    defaultValue: '',
    isRequired: true,
  },
  {
    label: 'Dari instansi mana Anda berasal?',
    id: 'instance',
    column: 'Asal Instansi',
    type: 'text',
    defaultValue: '',
    isRequired: true,
  },
  {
    label: 'Apa Anda seorang mahasiswa ITB?',
    id: 'isStudent',
    type: 'radio',
    options: ['Ya', 'Tidak'],
    defaultValue: '',
    isRequired: true,
    shouldRecorded: false,
  },
  {
    label: 'Apa jurusan Anda?',
    id: 'major',
    column: 'Jurusan (jika mahasiswa)',
    type: 'text',
    defaultValue: '',
    condition: {
      isStudent: 'Ya',
    },
  },
  {
    label: 'Anda angkatan berapa?',
    id: 'classOf',
    column: 'Angkatan (jika mahasiswa)',
    type: 'text',
    defaultValue: '',
    condition: {
      isStudent: 'Ya',
    },
  },
  {
    label: 'Apa alamat email Anda?',
    id: 'email',
    column: 'Email',
    type: 'email',
    defaultValue: '',
    isRequired: true,
  },
  {
    label: 'Apa nomor WhatsApp Anda?',
    id: 'whatsapp',
    column: 'Whatsapp',
    type: 'text',
    defaultValue: '',
    isRequired: true,
  },
  {
    label: 'Apa ID Line Anda?',
    id: 'line',
    column: 'ID Line',
    type: 'text',
    defaultValue: '',
  },
  {
    label: 'Jenis Proyek',
    id: 'type',
    column: 'Jenis Proyek',
    type: 'checkbox',
    options: ['Website', 'Aplikasi Android', 'Aplikasi iOS', 'Game', 'Prototype', 'Mockup'],
    hasCustomInput: true,
    defaultValue: [],
    isRequired: true,
  },
  {
    label: 'Tujuan pembuatan proyek',
    id: 'motive',
    column: 'Tujuan Pembuatan Proyek',
    type: 'radio',
    options: [
      'Menyelesaikan Tugas Kuliah',
      'Menyelesaikan Skripsi',
      'Menyelesaikan Thesis',
      'Membuat Startup',
      'Memenuhi keperluan perusahaan',
      'Memenuhi keperluan acara, misalnya lomba',
    ],
    hasCustomInput: true,
    defaultValue: '',
    isRequired: true,
  },
  {
    label: 'Deskripsi proyek',
    id: 'description',
    column: 'Deskripsi Proyek (semakin detail semakin baik)',
    type: 'textarea',
    defaultValue: '',
    isRequired: true,
  },
  {
    label: 'Berapa ekspektasi biaya Anda untuk proyek ini?',
    id: 'fee',
    column: 'Ekspektasi Biaya (Rp.)',
    type: 'text',
    defaultValue: '',
  },
  {
    label: 'Kapan deadline Anda untuk proyek ini?',
    id: 'deadline',
    column: 'Deadline',
    type: 'date',
    defaultValue: '',
  },
  {
    label: 'Apa Anda sudah memiliki desain untuk proyek ini?',
    id: 'isDesignExist',
    column: 'Apakah sudah memiliki rancangan tampilan dan desain?',
    type: 'radio',
    options: [
      'Sudah',
      'Belum, namun akan dibuat segera dari pihak client sepenuhnya',
      'Belum dan membutuhkan bantuan berunding dengan pihak pembuat proyek',
      'Belum dan dibebaskan kepada pihak pembuat proyek',
    ],
    defaultValue: '',
    isRequired: true,
  },
  {
    label: 'Dalam bentuk apa desain yang Anda miliki?',
    id: 'design',
    column: 'Bentuk rancangan tampilan / desain jika sudah memiliki',
    type: 'checkbox',
    options: [
      'Mockup Digital (marvelapp, balsamiq, dsb.)',
      'File Gambar Digital (Photoshop, Ai, Sketch, dsb.)',
      'Design manual di kertas',
    ],
    hasCustomInput: true,
    defaultValue: [],
    condition: {
      isDesignExist: 'Sudah',
    },
    isRequired: true,
  },
  {
    label: 'Catatan untuk proyek ini',
    id: 'notes',
    column: 'Catatan Tambahan',
    type: 'textarea',
    defaultValue: '',
  },
  {
    label: 'Ada yang ingin Anda tanyakan?',
    id: 'question',
    column: 'Pertanyaan',
    type: 'textarea',
    defaultValue: '',
  },
];

export const notices = [
  'Pertimbangkan deadline & biaya dengan kompleksitas proyek.',
  'Proyek yang kami prioritaskan adalah proyek dengan deadline & biaya yang sesuai dengan kompleksitas proyek',
  'Proyek yang sudah memiliki rancangan tampilan & desain akan dapat diproses dengan lebih cepat.',
];

export const contacts = ['Patrick (081808848228)'];
