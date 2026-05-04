/* eslint-disable @typescript-eslint/no-require-imports */
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  HeadingLevel, AlignmentType, LevelFormat, BorderStyle, WidthType,
  ShadingType, VerticalAlign, PageNumber, PageBreak, Header, Footer,
  TabStopType, TabStopPosition
} = require('docx');
const fs = require('fs');

// === Colors ===
const PINK = "E91E8C";
const PINK_LIGHT = "FCE4F1";
const PINK_MID = "F8C8E8";
const GRAY_LIGHT = "F5F5F5";
const GRAY_BORDER = "DDDDDD";
const DARK = "1A1A2E";
const WHITE = "FFFFFF";
const ORANGE = "FF6B35";
const BLUE_INFO = "1565C0";
const GREEN = "2E7D32";

const border = { style: BorderStyle.SINGLE, size: 1, color: GRAY_BORDER };
const borders = { top: border, bottom: border, left: border, right: border };
const noBorder = { style: BorderStyle.NONE, size: 0, color: WHITE };
const noBorders = { top: noBorder, bottom: noBorder, left: noBorder, right: noBorder };

function h1(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 360, after: 180 },
    children: [new TextRun({ text, bold: true, size: 36, color: DARK, font: "Arial" })]
  });
}

function h2(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 300, after: 120 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: PINK } },
    children: [new TextRun({ text, bold: true, size: 28, color: DARK, font: "Arial" })]
  });
}

function h3(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_3,
    spacing: { before: 220, after: 80 },
    children: [new TextRun({ text, bold: true, size: 24, color: PINK, font: "Arial" })]
  });
}

function p(text, opts = {}) {
  return new Paragraph({
    spacing: { before: 80, after: 80 },
    children: [new TextRun({ text, size: 22, font: "Arial", color: DARK, ...opts })]
  });
}

function bullet(text, ref = "bullets") {
  return new Paragraph({
    numbering: { reference: ref, level: 0 },
    spacing: { before: 60, after: 60 },
    children: [new TextRun({ text, size: 22, font: "Arial", color: DARK })]
  });
}

function spacer() {
  return new Paragraph({ spacing: { before: 60, after: 60 }, children: [new TextRun("")] });
}

function infoBox(label, value, fillColor = PINK_LIGHT) {
  return new TableRow({
    children: [
      new TableCell({
        borders,
        width: { size: 2500, type: WidthType.DXA },
        shading: { fill: PINK_MID, type: ShadingType.CLEAR },
        margins: { top: 80, bottom: 80, left: 120, right: 120 },
        children: [new Paragraph({ children: [new TextRun({ text: label, bold: true, size: 20, font: "Arial", color: DARK })] })]
      }),
      new TableCell({
        borders,
        width: { size: 6860, type: WidthType.DXA },
        shading: { fill: fillColor, type: ShadingType.CLEAR },
        margins: { top: 80, bottom: 80, left: 120, right: 120 },
        children: [new Paragraph({ children: [new TextRun({ text: value, size: 20, font: "Arial", color: DARK })] })]
      })
    ]
  });
}

function featureRow(id, feature, priority, deskripsi, fillColor = WHITE) {
  const priorityColor = priority === "P0" ? "B71C1C" : priority === "P1" ? ORANGE : priority === "P2" ? BLUE_INFO : GREEN;
  return new TableRow({
    children: [
      new TableCell({
        borders,
        width: { size: 700, type: WidthType.DXA },
        shading: { fill: fillColor, type: ShadingType.CLEAR },
        margins: { top: 60, bottom: 60, left: 100, right: 100 },
        children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: id, size: 18, bold: true, font: "Arial", color: BLUE_INFO })] })]
      }),
      new TableCell({
        borders,
        width: { size: 2200, type: WidthType.DXA },
        shading: { fill: fillColor, type: ShadingType.CLEAR },
        margins: { top: 60, bottom: 60, left: 100, right: 100 },
        children: [new Paragraph({ children: [new TextRun({ text: feature, size: 18, bold: true, font: "Arial", color: DARK })] })]
      }),
      new TableCell({
        borders,
        width: { size: 700, type: WidthType.DXA },
        shading: { fill: fillColor, type: ShadingType.CLEAR },
        margins: { top: 60, bottom: 60, left: 80, right: 80 },
        children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: priority, size: 18, bold: true, font: "Arial", color: priorityColor })] })]
      }),
      new TableCell({
        borders,
        width: { size: 5760, type: WidthType.DXA },
        shading: { fill: fillColor, type: ShadingType.CLEAR },
        margins: { top: 60, bottom: 60, left: 100, right: 100 },
        children: [new Paragraph({ children: [new TextRun({ text: deskripsi, size: 18, font: "Arial", color: DARK })] })]
      }),
    ]
  });
}

function tableHeader(cols, widths) {
  return new TableRow({
    tableHeader: true,
    children: cols.map((col, i) => new TableCell({
      borders,
      width: { size: widths[i], type: WidthType.DXA },
      shading: { fill: DARK, type: ShadingType.CLEAR },
      margins: { top: 80, bottom: 80, left: 120, right: 120 },
      verticalAlign: VerticalAlign.CENTER,
      children: [new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: col, bold: true, size: 20, font: "Arial", color: WHITE })]
      })]
    }))
  });
}

// Cover section
function coverPage() {
  return [
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 1440, after: 0 },
      children: [new TextRun({ text: "✦ FOTO·ESTETIK — POJOKPOTRET", size: 24, font: "Arial", color: PINK, bold: true })]
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 240, after: 0 },
      children: [new TextRun({ text: "Product Requirements Document", size: 56, bold: true, font: "Arial", color: DARK })]
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 120, after: 0 },
      children: [new TextRun({ text: "Fitur Editor Foto (Tahap 3: Edit & Hias)", size: 32, font: "Arial", color: PINK })]
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 480, after: 0 },
      children: [new TextRun({ text: "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━", size: 24, font: "Arial", color: PINK })]
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 480, after: 60 },
      children: [new TextRun({ text: "Versi Dokumen: 1.0", size: 22, font: "Arial", color: DARK })]
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 0, after: 60 },
      children: [new TextRun({ text: "Tanggal: Mei 2025", size: 22, font: "Arial", color: DARK })]
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 0, after: 60 },
      children: [new TextRun({ text: "Status: Draft", size: 22, font: "Arial", color: DARK })]
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 0, after: 60 },
      children: [new TextRun({ text: "Platform: Web (pojokpotret-app-nextjs.vercel.app)", size: 22, font: "Arial", color: DARK })]
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 960, after: 0 },
      children: [new TextRun({ text: "🌸  🌸  🌸", size: 28, font: "Arial" })]
    }),
    new Paragraph({ children: [new PageBreak()] }),
  ];
}

const doc = new Document({
  numbering: {
    config: [
      {
        reference: "bullets",
        levels: [{
          level: 0, format: LevelFormat.BULLET, text: "•", alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } }
        }]
      },
      {
        reference: "numbers",
        levels: [{
          level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } }
        }]
      },
      {
        reference: "numbers2",
        levels: [{
          level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } }
        }]
      },
      {
        reference: "sub-bullets",
        levels: [{
          level: 0, format: LevelFormat.BULLET, text: "–", alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 1080, hanging: 360 } } }
        }]
      }
    ]
  },
  styles: {
    default: { document: { run: { font: "Arial", size: 22, color: DARK } } },
    paragraphStyles: [
      { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 36, bold: true, font: "Arial", color: DARK },
        paragraph: { spacing: { before: 360, after: 180 }, outlineLevel: 0 } },
      { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 28, bold: true, font: "Arial", color: DARK },
        paragraph: { spacing: { before: 300, after: 120 }, outlineLevel: 1 } },
      { id: "Heading3", name: "Heading 3", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 24, bold: true, font: "Arial", color: PINK },
        paragraph: { spacing: { before: 220, after: 80 }, outlineLevel: 2 } },
    ]
  },
  sections: [{
    properties: {
      page: {
        size: { width: 12240, height: 15840 },
        margin: { top: 1080, right: 1080, bottom: 1080, left: 1080 }
      }
    },
    headers: {
      default: new Header({
        children: [new Paragraph({
          border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: PINK } },
          spacing: { before: 0, after: 120 },
          children: [
            new TextRun({ text: "✦ Foto·Estetik — PRD: Fitur Editor Foto", size: 18, font: "Arial", color: PINK, bold: true }),
            new TextRun({ text: "     |     Versi 1.0     |     Mei 2025", size: 18, font: "Arial", color: "888888" }),
          ]
        })]
      })
    },
    footers: {
      default: new Footer({
        children: [new Paragraph({
          border: { top: { style: BorderStyle.SINGLE, size: 4, color: PINK } },
          spacing: { before: 120, after: 0 },
          alignment: AlignmentType.CENTER,
          children: [
            new TextRun({ text: "Halaman ", size: 18, font: "Arial", color: "888888" }),
            new TextRun({ children: [PageNumber.CURRENT], size: 18, font: "Arial", color: "888888" }),
            new TextRun({ text: "  |  Dokumen Rahasia & Internal", size: 18, font: "Arial", color: "888888" }),
          ]
        })]
      })
    },
    children: [
      ...coverPage(),

      // ==================== BAGIAN 1 ====================
      h1("1. Ringkasan Eksekutif"),
      p("Dokumen ini merupakan Product Requirements Document (PRD) untuk fitur Editor Foto pada platform Foto·Estetik (PojokPotret) — sebuah aplikasi photo booth digital berbasis web. Fitur editor merupakan tahap ketiga dan terakhir dalam alur penggunaan aplikasi, setelah pengguna memilih mode (Tahap 1) dan mengatur sesi foto (Tahap 2)."),
      spacer(),
      p("Editor Foto berfungsi sebagai kanvas kreatif tempat pengguna dapat menghias, mempersonalisasi, dan menyimpan hasil foto booth mereka. Fitur ini adalah titik krusial yang menentukan kepuasan pengguna sebelum mereka mengunduh atau membagikan hasil foto ke media sosial."),
      spacer(),

      // Info table
      new Table({
        width: { size: 9360, type: WidthType.DXA },
        columnWidths: [2500, 6860],
        rows: [
          infoBox("Nama Produk", "Foto·Estetik — Photo Booth Digital"),
          infoBox("Nama Fitur", "Editor Foto (Tahap 3: Edit & Hias)", GRAY_LIGHT),
          infoBox("URL", "https://pojokpotret-app-nextjs.vercel.app/editor"),
          infoBox("Versi Dokumen", "1.0", GRAY_LIGHT),
          infoBox("Tanggal", "Mei 2025"),
          infoBox("Status", "Draft — Menunggu Review Tim", GRAY_LIGHT),
          infoBox("Penulis", "Product Team — PojokPotret"),
        ]
      }),
      spacer(),
      new Paragraph({ children: [new PageBreak()] }),

      // ==================== BAGIAN 2 ====================
      h1("2. Latar Belakang & Konteks Produk"),
      h2("2.1 Tentang Foto·Estetik"),
      p("Foto·Estetik adalah platform photo booth digital yang memungkinkan pengguna mengambil foto dengan berbagai mode, mempercantiknya dengan template eksklusif, filter, stiker, dan teks, lalu menyimpan atau membagikannya ke media sosial. Aplikasi ini memiliki lebih dari 1 juta pengguna aktif dengan rating 4,9/5."),
      spacer(),
      h2("2.2 Alur Pengguna (User Flow)"),
      p("Pengguna melewati 3 tahap untuk menghasilkan foto estetik:"),
      spacer(),
      new Table({
        width: { size: 9360, type: WidthType.DXA },
        columnWidths: [1000, 2500, 5860],
        rows: [
          new TableRow({
            children: [
              new TableCell({ borders, width: { size: 1000, type: WidthType.DXA }, shading: { fill: DARK, type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 120 },
                children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Tahap", bold: true, size: 20, font: "Arial", color: WHITE })] })] }),
              new TableCell({ borders, width: { size: 2500, type: WidthType.DXA }, shading: { fill: DARK, type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 120 },
                children: [new Paragraph({ children: [new TextRun({ text: "Nama", bold: true, size: 20, font: "Arial", color: WHITE })] })] }),
              new TableCell({ borders, width: { size: 5860, type: WidthType.DXA }, shading: { fill: DARK, type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 120 },
                children: [new Paragraph({ children: [new TextRun({ text: "Deskripsi", bold: true, size: 20, font: "Arial", color: WHITE })] })] }),
            ]
          }),
          new TableRow({ children: [
            new TableCell({ borders, width: { size: 1000, type: WidthType.DXA }, shading: { fill: PINK_LIGHT, type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 120 },
              children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "1", bold: true, size: 20, font: "Arial", color: PINK })] })] }),
            new TableCell({ borders, width: { size: 2500, type: WidthType.DXA }, shading: { fill: PINK_LIGHT, type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 120 },
              children: [new Paragraph({ children: [new TextRun({ text: "Pilih Mode", size: 20, font: "Arial", color: DARK })] })] }),
            new TableCell({ borders, width: { size: 5860, type: WidthType.DXA }, shading: { fill: PINK_LIGHT, type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 120 },
              children: [new Paragraph({ children: [new TextRun({ text: "Pengguna memilih mode pengambilan foto: Photo Booth, Upload, Multi Shot, dll.", size: 20, font: "Arial", color: DARK })] })] }),
          ]}),
          new TableRow({ children: [
            new TableCell({ borders, width: { size: 1000, type: WidthType.DXA }, shading: { fill: GRAY_LIGHT, type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 120 },
              children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "2", bold: true, size: 20, font: "Arial", color: PINK })] })] }),
            new TableCell({ borders, width: { size: 2500, type: WidthType.DXA }, shading: { fill: GRAY_LIGHT, type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 120 },
              children: [new Paragraph({ children: [new TextRun({ text: "Atur Sesi (Capture)", size: 20, font: "Arial", color: DARK })] })] }),
            new TableCell({ borders, width: { size: 5860, type: WidthType.DXA }, shading: { fill: GRAY_LIGHT, type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 120 },
              children: [new Paragraph({ children: [new TextRun({ text: "Memilih layout (2–8 foto, portrait/landscape), filter kamera, timer otomatis (3/5/10 detik), dan mengambil foto via kamera atau upload.", size: 20, font: "Arial", color: DARK })] })] }),
          ]}),
          new TableRow({ children: [
            new TableCell({ borders, width: { size: 1000, type: WidthType.DXA }, shading: { fill: PINK_LIGHT, type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 120 },
              children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "3 ★", bold: true, size: 20, font: "Arial", color: PINK })] })] }),
            new TableCell({ borders, width: { size: 2500, type: WidthType.DXA }, shading: { fill: PINK_LIGHT, type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 120 },
              children: [new Paragraph({ children: [new TextRun({ text: "Edit & Hias [FOKUS PRD INI]", bold: true, size: 20, font: "Arial", color: PINK })] })] }),
            new TableCell({ borders, width: { size: 5860, type: WidthType.DXA }, shading: { fill: PINK_LIGHT, type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 120 },
              children: [new Paragraph({ children: [new TextRun({ text: "Pengguna menghias foto dengan filter, stiker, teks, frame, lalu menyimpan atau membagikan hasilnya.", size: 20, font: "Arial", color: DARK })] })] }),
          ]}),
        ]
      }),
      spacer(),
      new Paragraph({ children: [new PageBreak()] }),

      // ==================== BAGIAN 3 ====================
      h1("3. Tujuan & Sasaran Produk"),
      h2("3.1 Tujuan Bisnis"),
      bullet("Meningkatkan retensi pengguna dengan memberikan pengalaman editing yang menyenangkan dan mudah."),
      bullet("Mendorong konversi ke plan Premium melalui fitur editing eksklusif yang terkunci di Free Plan."),
      bullet("Meningkatkan virality produk karena pengguna membagikan hasil foto yang berkualitas ke media sosial."),
      bullet("Memperkuat brand positioning sebagai platform photo booth estetik #1 di Indonesia."),
      spacer(),
      h2("3.2 Tujuan Pengguna"),
      bullet("Mendapatkan foto estetik yang siap dibagikan tanpa perlu keahlian desain grafis."),
      bullet("Proses editing yang cepat (< 5 menit) dan intuitif."),
      bullet("Hasil foto terasa personal dan unik berkat kombinasi filter, stiker, dan teks."),
      spacer(),
      h2("3.3 Key Results (Metrik Sukses)"),
      new Table({
        width: { size: 9360, type: WidthType.DXA },
        columnWidths: [3000, 3180, 3180],
        rows: [
          new TableRow({
            children: [
              new TableCell({ borders, width: { size: 3000, type: WidthType.DXA }, shading: { fill: DARK, type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 120 },
                children: [new Paragraph({ children: [new TextRun({ text: "Metrik", bold: true, size: 20, font: "Arial", color: WHITE })] })] }),
              new TableCell({ borders, width: { size: 3180, type: WidthType.DXA }, shading: { fill: DARK, type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 120 },
                children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Baseline", bold: true, size: 20, font: "Arial", color: WHITE })] })] }),
              new TableCell({ borders, width: { size: 3180, type: WidthType.DXA }, shading: { fill: DARK, type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 120 },
                children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Target (3 Bulan)", bold: true, size: 20, font: "Arial", color: WHITE })] })] }),
            ]
          }),
          ...[ 
            ["Completion rate editor (selesai hingga simpan)", "—", "> 75%"],
            ["Rata-rata waktu di halaman editor", "—", "3–7 menit"],
            ["Tingkat share ke media sosial setelah simpan", "—", "> 40%"],
            ["Konversi Free → Premium dari editor", "—", "> 8%"],
            ["NPS fitur editor", "—", "> 50"],
          ].map(([m, b, t], i) => new TableRow({ children: [
            new TableCell({ borders, width: { size: 3000, type: WidthType.DXA }, shading: { fill: i % 2 === 0 ? GRAY_LIGHT : WHITE, type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 120 },
              children: [new Paragraph({ children: [new TextRun({ text: m, size: 20, font: "Arial", color: DARK })] })] }),
            new TableCell({ borders, width: { size: 3180, type: WidthType.DXA }, shading: { fill: i % 2 === 0 ? GRAY_LIGHT : WHITE, type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 120 },
              children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: b, size: 20, font: "Arial", color: "888888" })] })] }),
            new TableCell({ borders, width: { size: 3180, type: WidthType.DXA }, shading: { fill: i % 2 === 0 ? GRAY_LIGHT : WHITE, type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 120 },
              children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: t, size: 20, font: "Arial", color: GREEN, bold: true })] })] }),
          ]}))
        ]
      }),
      spacer(),
      new Paragraph({ children: [new PageBreak()] }),

      // ==================== BAGIAN 4 ====================
      h1("4. Pengguna & Persona"),
      h2("4.1 Target Pengguna"),
      bullet("Usia 15–30 tahun, dominan perempuan"),
      bullet("Pengguna aktif media sosial (Instagram, TikTok)"),
      bullet("Terbiasa dengan estetika foto Korea/Jepang (photobooth style)"),
      bullet("Menggunakan perangkat mobile maupun desktop"),
      spacer(),
      h2("4.2 Persona Utama"),
      new Table({
        width: { size: 9360, type: WidthType.DXA },
        columnWidths: [4680, 4680],
        rows: [
          new TableRow({ children: [
            new TableCell({ borders, width: { size: 4680, type: WidthType.DXA }, shading: { fill: PINK_MID, type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 140, right: 140 },
              children: [
                new Paragraph({ children: [new TextRun({ text: "💁♀️  Dinda, 19 tahun — Mahasiswi", bold: true, size: 22, font: "Arial", color: DARK })] }),
                new Paragraph({ spacing: { before: 60, after: 60 }, children: [new TextRun({ text: "Suka foto-foto bareng teman, ingin hasil yang cantik dan siap dibagikan ke Instagram tanpa effort besar. Tidak mau belajar Photoshop.", size: 20, font: "Arial", color: DARK })] }),
                new Paragraph({ spacing: { before: 80 }, children: [new TextRun({ text: "Goal: Foto estetik dalam < 5 menit", size: 20, font: "Arial", color: PINK, bold: true })] }),
              ]
            }),
            new TableCell({ borders, width: { size: 4680, type: WidthType.DXA }, shading: { fill: GRAY_LIGHT, type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 140, right: 140 },
              children: [
                new Paragraph({ children: [new TextRun({ text: "📸  Rizky, 25 tahun — Content Creator", bold: true, size: 22, font: "Arial", color: DARK })] }),
                new Paragraph({ spacing: { before: 60, after: 60 }, children: [new TextRun({ text: "Menggunakan platform untuk membuat konten photobooth untuk TikTok. Ingin fitur yang lebih canggih seperti custom frame dan watermark brand.", size: 20, font: "Arial", color: DARK })] }),
                new Paragraph({ spacing: { before: 80 }, children: [new TextRun({ text: "Goal: Konten photobooth branded yang unik", size: 20, font: "Arial", color: PINK, bold: true })] }),
              ]
            }),
          ]})
        ]
      }),
      spacer(),
      new Paragraph({ children: [new PageBreak()] }),

      // ==================== BAGIAN 5 ====================
      h1("5. Spesifikasi Fitur Editor"),
      h2("5.1 Struktur Halaman Editor"),
      p("Halaman editor terdiri dari tiga area utama:"),
      bullet("Navigasi & Stepper — Header dengan breadcrumb progres (Tahap 1 → 2 → 3) dan tombol navigasi"),
      bullet("Panel Editing — Area tengah berisi canvas foto dan kontrol editing"),
      bullet("Toolbar Aksi — Tombol Simpan Hasil dan navigasi kembali"),
      spacer(),
      h2("5.2 Daftar Fitur Lengkap"),
      p("Kode prioritas: P0 = Must Have | P1 = Should Have | P2 = Nice to Have | P3 = Future"),
      spacer(),
      new Table({
        width: { size: 9360, type: WidthType.DXA },
        columnWidths: [700, 2200, 700, 5760],
        rows: [
          tableHeader(["ID", "Fitur", "Prior.", "Deskripsi Singkat"], [700, 2200, 700, 5760]),
          featureRow("F-01", "Preview Canvas Foto", "P0", "Menampilkan foto yang diambil/diupload dari tahap sebelumnya dalam layout yang dipilih (2–8 frame, portrait/landscape)."),
          featureRow("F-02", "Stepper Navigasi", "P0", "Indikator progres tiga tahap yang interaktif — pengguna dapat kembali ke tahap sebelumnya.", GRAY_LIGHT),
          featureRow("F-03", "Simpan Hasil", "P0", "Tombol untuk mengunduh foto yang sudah diedit dalam format HD ke perangkat pengguna."),
          featureRow("F-04", "Aplikasi Filter Foto", "P0", "Terapkan filter langsung pada canvas: Normal, B&W, Warm, Cool, Vivid, Fade, dan pilihan lainnya.", GRAY_LIGHT),
          featureRow("F-05", "Penambahan Stiker", "P1", "Menyisipkan stiker emoji atau dekorasi (🌸, 💖, 😊, dll.) di atas foto. Stiker dapat dipindah dan diubah ukurannya."),
          featureRow("F-06", "Penambahan Teks", "P1", "Menambahkan teks custom ke foto (contoh: 'Good vibes 💕', tanggal, nama). Pilihan font, warna, dan ukuran.", GRAY_LIGHT),
          featureRow("F-07", "Frame / Border Foto", "P1", "Memilih frame dekoratif di sekitar setiap foto atau seluruh strip foto. Termasuk pilihan warna background."),
          featureRow("F-08", "Template Estetik", "P1", "Menerapkan template lengkap yang mencakup kombinasi frame + filter + elemen dekoratif preset.", GRAY_LIGHT),
          featureRow("F-09", "Undo / Redo", "P1", "Kemampuan membatalkan atau mengulangi aksi editing terakhir."),
          featureRow("F-10", "Bagikan ke Medsos", "P1", "Opsi berbagi langsung ke Instagram, TikTok, atau copy link/gambar.", GRAY_LIGHT),
          featureRow("F-11", "Watermark Branding", "P2", "Watermark 'Foto·Estetik' kecil di sudut foto (dapat dihilangkan oleh pengguna Premium)."),
          featureRow("F-12", "Pilihan Resolusi Unduh", "P2", "Memilih kualitas unduhan: Web (compressed) atau HD (full quality — Premium only).", GRAY_LIGHT),
          featureRow("F-13", "Simpan ke Riwayat Cloud", "P2", "Menyimpan sesi edit ke akun pengguna sehingga dapat diakses kembali (Premium)."),
          featureRow("F-14", "Kolaborasi Real-time", "P3", "Beberapa pengguna bisa mengedit atau menambahkan stiker pada foto yang sama secara bersamaan.", GRAY_LIGHT),
          featureRow("F-15", "AI Auto-Enhance", "P3", "Rekomendasi filter dan layout terbaik berdasarkan analisis foto menggunakan AI."),
        ]
      }),
      spacer(),
      new Paragraph({ children: [new PageBreak()] }),

      // ==================== BAGIAN 6 ====================
      h1("6. User Stories & Acceptance Criteria"),

      h2("6.1 Preview & Canvas"),
      h3("US-01 — Melihat Foto Hasil Sesi"),
      p("Sebagai pengguna, saya ingin melihat semua foto dari sesi sebelumnya dalam layout yang saya pilih, agar saya bisa memastikan hasilnya sebelum mengedit."),
      spacer(),
      p("Acceptance Criteria:", { bold: true }),
      bullet("Seluruh foto dari Tahap 2 tampil pada canvas sesuai layout (contoh: 2 Frame Portrait)."),
      bullet("Foto ditampilkan secara proporsional tanpa distorsi."),
      bullet("Teks watermark sementara ('Hasil akhir akan lebih bagus setelah proses edit') tampil di bawah preview."),
      bullet("Loading canvas tidak lebih dari 2 detik pada koneksi 4G normal."),
      spacer(),

      h2("6.2 Filter"),
      h3("US-02 — Menerapkan Filter Foto"),
      p("Sebagai pengguna, saya ingin memilih dan menerapkan filter warna pada foto saya, agar foto terlihat lebih estetik sesuai mood yang saya inginkan."),
      spacer(),
      p("Acceptance Criteria:", { bold: true }),
      bullet("Tersedia minimal 6 filter: Normal, B&W, Warm, Cool, Vivid, Fade."),
      bullet("Filter diterapkan secara real-time (preview langsung di canvas, tidak perlu konfirmasi)."),
      bullet("Filter yang sedang aktif ditandai dengan highlight/border visual yang jelas."),
      bullet("Pengguna dapat kembali ke filter Normal kapan saja."),
      bullet("Filter yang diterapkan saat simpan ikut ter-render pada hasil akhir."),
      spacer(),

      h2("6.3 Stiker"),
      h3("US-03 — Menambahkan Stiker Dekoratif"),
      p("Sebagai pengguna, saya ingin menambahkan stiker atau emoji ke foto saya, agar hasil foto lebih fun dan personal."),
      spacer(),
      p("Acceptance Criteria:", { bold: true }),
      bullet("Tersedia minimum 20 stiker bawaan (emoji, bunga, bintang, hati, dll.)."),
      bullet("Pengguna dapat menempatkan stiker di posisi mana pun pada canvas dengan drag-and-drop."),
      bullet("Stiker dapat diubah ukurannya dengan gesture pinch-zoom (mobile) atau handle resize (desktop)."),
      bullet("Stiker dapat dihapus dengan tombol delete atau double-tap."),
      bullet("Pengguna dapat menambahkan lebih dari satu stiker sekaligus."),
      spacer(),

      h2("6.4 Teks"),
      h3("US-04 — Menambahkan Teks Custom"),
      p("Sebagai pengguna, saya ingin menambahkan tulisan kustom (seperti nama atau kutipan) ke foto, agar semakin berkesan dan personal."),
      spacer(),
      p("Acceptance Criteria:", { bold: true }),
      bullet("Pengguna dapat mengetikkan teks bebas dengan panjang maksimal 100 karakter per elemen."),
      bullet("Tersedia pilihan minimal 5 font yang berbeda."),
      bullet("Pengguna dapat memilih warna teks dari color picker."),
      bullet("Teks dapat dipindahkan (drag), dirotasi, dan diubah ukurannya."),
      bullet("Teks dapat diedit kembali setelah ditempatkan (double-tap/click untuk edit)."),
      spacer(),

      h2("6.5 Simpan"),
      h3("US-05 — Menyimpan & Mengunduh Hasil"),
      p("Sebagai pengguna, saya ingin mengunduh foto yang sudah diedit ke perangkat saya, agar bisa langsung dibagikan ke media sosial."),
      spacer(),
      p("Acceptance Criteria:", { bold: true }),
      bullet("Tombol 'Simpan Hasil' selalu tersedia di header kanan atas."),
      bullet("Pengguna diberikan dialog konfirmasi sebelum proses rendering dimulai."),
      bullet("Proses render tidak lebih dari 5 detik untuk strip foto 4 frame di perangkat rata-rata."),
      bullet("File yang diunduh adalah gambar PNG/JPG dengan resolusi minimum 1080px pada sisi terpendek."),
      bullet("Muncul notifikasi sukses setelah unduhan berhasil."),
      spacer(),
      new Paragraph({ children: [new PageBreak()] }),

      // ==================== BAGIAN 7 ====================
      h1("7. Desain & UX Requirements"),
      h2("7.1 Visual & Estetika"),
      bullet("Palette warna utama: Pink (#E91E8C) sebagai warna aksen, dengan latar putih bersih."),
      bullet("Tipografi: Rounded/sans-serif font yang terasa friendly dan muda (konsisten dengan brand)."),
      bullet("Ilustrasi dan ikon menggunakan gaya kawaii/estetik Jepang-Korea."),
      bullet("Animasi transisi antar tahap harus smooth (ease-in-out, 200–300ms)."),
      spacer(),
      h2("7.2 Layout & Responsivitas"),
      bullet("Desktop: Panel editing dua kolom — canvas di kiri, toolbar di kanan."),
      bullet("Mobile: Panel editing satu kolom — canvas di atas, toolbar scrollable di bawah."),
      bullet("Canvas harus mempertahankan aspect ratio foto asli tanpa clipping."),
      bullet("Touch gesture (pinch, drag, tap) harus berfungsi sempurna di perangkat mobile."),
      spacer(),
      h2("7.3 Aksesibilitas"),
      bullet("Semua tombol interaktif memiliki ukuran tap target minimum 44x44px."),
      bullet("Label teks alternatif (alt text) tersedia untuk semua elemen gambar."),
      bullet("Kontras warna memenuhi standar WCAG 2.1 level AA."),
      bullet("Keyboard navigasi berfungsi penuh untuk pengguna desktop."),
      spacer(),
      new Paragraph({ children: [new PageBreak()] }),

      // ==================== BAGIAN 8 ====================
      h1("8. Kebutuhan Teknis"),
      h2("8.1 Teknologi & Stack"),
      bullet("Framework: Next.js (React) — SSR/SSG untuk performa optimal."),
      bullet("Canvas Rendering: HTML5 Canvas API atau Fabric.js untuk manipulasi foto real-time."),
      bullet("State Management: React Context / Zustand untuk state editor yang kompleks."),
      bullet("Image Processing: Client-side (browser) untuk menjaga privasi pengguna; tidak upload foto ke server."),
      bullet("Download: canvas.toBlob() / toDataURL() untuk ekspor gambar langsung di browser."),
      spacer(),
      h2("8.2 Performa"),
      bullet("Time to Interactive (TTI) halaman editor: < 3 detik pada koneksi 4G."),
      bullet("Frame rate canvas editing minimum 30fps pada perangkat mid-range."),
      bullet("Ukuran bundle JavaScript editor: < 500KB (gzipped)."),
      bullet("Proses render & download foto: < 5 detik."),
      spacer(),
      h2("8.3 Keamanan & Privasi"),
      bullet("Foto pengguna TIDAK diunggah ke server manapun — semua processing dilakukan client-side."),
      bullet("Tidak ada penyimpanan foto di cloud kecuali pengguna Premium yang secara eksplisit mengaktifkan fitur Simpan ke Riwayat."),
      bullet("Sesi foto dihapus dari memori browser setelah pengguna menutup tab."),
      spacer(),
      new Paragraph({ children: [new PageBreak()] }),

      // ==================== BAGIAN 9 ====================
      h1("9. Diferensiasi Free vs Premium"),
      new Table({
        width: { size: 9360, type: WidthType.DXA },
        columnWidths: [3160, 3100, 3100],
        rows: [
          new TableRow({ children: [
            new TableCell({ borders, width: { size: 3160, type: WidthType.DXA }, shading: { fill: DARK, type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 120 },
              children: [new Paragraph({ children: [new TextRun({ text: "Fitur", bold: true, size: 20, font: "Arial", color: WHITE })] })] }),
            new TableCell({ borders, width: { size: 3100, type: WidthType.DXA }, shading: { fill: DARK, type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 120 },
              children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Free Plan", bold: true, size: 20, font: "Arial", color: WHITE })] })] }),
            new TableCell({ borders, width: { size: 3100, type: WidthType.DXA }, shading: { fill: PINK, type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 120 },
              children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Premium Plan ✦", bold: true, size: 20, font: "Arial", color: WHITE })] })] }),
          ]}),
          ...[
            ["Filter Foto", "6 filter dasar", "20+ filter eksklusif"],
            ["Stiker", "20 stiker bawaan", "100+ stiker premium + pack seasonal"],
            ["Teks", "3 pilihan font", "15+ font pilihan"],
            ["Frame & Template", "5 template gratis", "500+ template eksklusif"],
            ["Watermark", "Ada watermark Foto·Estetik", "Tanpa watermark"],
            ["Resolusi Unduhan", "Standar (compressed)", "HD & 4K"],
            ["Simpan ke Cloud", "Tidak tersedia", "Tersedia (riwayat tak terbatas)"],
            ["Hapus Background", "Tidak tersedia", "Tersedia (AI-powered)"],
          ].map(([f, fr, pr], i) => new TableRow({ children: [
            new TableCell({ borders, width: { size: 3160, type: WidthType.DXA }, shading: { fill: i % 2 === 0 ? GRAY_LIGHT : WHITE, type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 120 },
              children: [new Paragraph({ children: [new TextRun({ text: f, size: 20, font: "Arial", color: DARK })] })] }),
            new TableCell({ borders, width: { size: 3100, type: WidthType.DXA }, shading: { fill: i % 2 === 0 ? GRAY_LIGHT : WHITE, type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 120 },
              children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: fr, size: 20, font: "Arial", color: "555555" })] })] }),
            new TableCell({ borders, width: { size: 3100, type: WidthType.DXA }, shading: { fill: i % 2 === 0 ? PINK_LIGHT : WHITE, type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 120 },
              children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: pr, size: 20, font: "Arial", color: PINK, bold: true })] })] }),
          ]}))
        ]
      }),
      spacer(),
      new Paragraph({ children: [new PageBreak()] }),

      // ==================== BAGIAN 10 ====================
      h1("10. Asumsi, Risiko & Mitigasi"),
      h2("10.1 Asumsi"),
      bullet("Foto dari Tahap 2 (Capture) selalu tersedia di state aplikasi saat editor dibuka."),
      bullet("Pengguna memiliki browser modern yang mendukung HTML5 Canvas API."),
      bullet("Mayoritas pengguna mengakses via mobile (Android/iOS Chrome/Safari)."),
      spacer(),
      h2("10.2 Risiko & Mitigasi"),
      new Table({
        width: { size: 9360, type: WidthType.DXA },
        columnWidths: [3000, 2200, 4160],
        rows: [
          tableHeader(["Risiko", "Level", "Mitigasi"], [3000, 2200, 4160]),
          ...[
            ["Performa canvas lambat di device low-end", "Tinggi", "Optimasi dengan OffscreenCanvas & Web Workers. Batasi operasi sync pada main thread."],
            ["Foto hilang jika pengguna refresh halaman", "Tinggi", "Simpan state foto di sessionStorage sementara. Tampilkan warning sebelum refresh."],
            ["Ukuran file stiker & asset terlalu besar", "Sedang", "Gunakan SVG untuk stiker. Lazy-load asset berdasarkan panel yang dibuka."],
            ["Browser Safari tidak support beberapa Canvas API", "Sedang", "Testing lintas browser. Fallback ke library Fabric.js yang lebih kompatibel."],
            ["Pengguna tidak tahu cara menggunakan fitur editing", "Rendah", "Onboarding tooltip singkat saat pertama kali membuka editor. Tips pose sudah ada di tahap sebelumnya."],
          ].map(([r, l, m], i) => {
            const lvlColor = l === "Tinggi" ? "B71C1C" : l === "Sedang" ? ORANGE : GREEN;
            return new TableRow({ children: [
              new TableCell({ borders, width: { size: 3000, type: WidthType.DXA }, shading: { fill: i % 2 === 0 ? GRAY_LIGHT : WHITE, type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 120 },
                children: [new Paragraph({ children: [new TextRun({ text: r, size: 20, font: "Arial", color: DARK })] })] }),
              new TableCell({ borders, width: { size: 2200, type: WidthType.DXA }, shading: { fill: i % 2 === 0 ? GRAY_LIGHT : WHITE, type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 120 },
                children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: l, size: 20, font: "Arial", color: lvlColor, bold: true })] })] }),
              new TableCell({ borders, width: { size: 4160, type: WidthType.DXA }, shading: { fill: i % 2 === 0 ? GRAY_LIGHT : WHITE, type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 120 },
                children: [new Paragraph({ children: [new TextRun({ text: m, size: 20, font: "Arial", color: DARK })] })] }),
            ]});
          })
        ]
      }),
      spacer(),
      new Paragraph({ children: [new PageBreak()] }),

      // ==================== BAGIAN 11 ====================
      h1("11. Roadmap & Timeline"),
      new Table({
        width: { size: 9360, type: WidthType.DXA },
        columnWidths: [1400, 2560, 5400],
        rows: [
          tableHeader(["Sprint", "Estimasi", "Deliverable"], [1400, 2560, 5400]),
          ...[
            ["Sprint 1", "2 Minggu", "Canvas preview foto, navigasi stepper, navigasi kembali ke Capture, tombol Simpan Hasil (download dasar)."],
            ["Sprint 2", "2 Minggu", "Sistem filter foto (6 filter), undo/redo, optimasi performa canvas."],
            ["Sprint 3", "2 Minggu", "Panel stiker (drag, resize, delete), penambahan teks custom (3 font, color picker)."],
            ["Sprint 4", "2 Minggu", "Frame & template (5 gratis + slot Premium), integrasi gating Free vs Premium."],
            ["Sprint 5", "1 Minggu", "Fitur berbagi ke media sosial, watermark logic, finalisasi UX & bug fixing."],
            ["Sprint 6", "1 Minggu", "QA menyeluruh, performance testing, soft launch & monitoring metrik."],
          ].map(([s, e, d], i) => new TableRow({ children: [
            new TableCell({ borders, width: { size: 1400, type: WidthType.DXA }, shading: { fill: i % 2 === 0 ? PINK_LIGHT : WHITE, type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 120 },
              children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: s, size: 20, font: "Arial", color: PINK, bold: true })] })] }),
            new TableCell({ borders, width: { size: 2560, type: WidthType.DXA }, shading: { fill: i % 2 === 0 ? PINK_LIGHT : WHITE, type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 120 },
              children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: e, size: 20, font: "Arial", color: DARK })] })] }),
            new TableCell({ borders, width: { size: 5400, type: WidthType.DXA }, shading: { fill: i % 2 === 0 ? PINK_LIGHT : WHITE, type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 120 },
              children: [new Paragraph({ children: [new TextRun({ text: d, size: 20, font: "Arial", color: DARK })] })] }),
          ]}))
        ]
      }),
      spacer(),

      // ==================== BAGIAN 12 ====================
      h1("12. Pertanyaan Terbuka (Open Questions)"),
      bullet("Apakah filter akan diterapkan secara destruktif (langsung mengubah pixel) atau non-destruktif (layer terpisah)? → Rekomendasi: non-destruktif untuk mendukung undo/redo."),
      bullet("Berapa batas maksimal elemen (stiker + teks) yang dapat ditambahkan per canvas agar performa tetap optimal?"),
      bullet("Bagaimana flow saat pengguna Free mencoba fitur Premium? Apakah langsung diarahkan ke halaman harga atau ada upsell modal?"),
      bullet("Apakah perlu integrasi analytics event per aksi editor (klik filter, tambah stiker, dll.) untuk data product insight?"),
      bullet("Apakah format unduhan harus PNG, JPG, atau keduanya dengan pilihan dari pengguna?"),
      spacer(),

      // ==================== BAGIAN 13 ====================
      h1("13. Glossary"),
      new Table({
        width: { size: 9360, type: WidthType.DXA },
        columnWidths: [2500, 6860],
        rows: [
          new TableRow({ children: [
            new TableCell({ borders, width: { size: 2500, type: WidthType.DXA }, shading: { fill: DARK, type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 120 },
              children: [new Paragraph({ children: [new TextRun({ text: "Istilah", bold: true, size: 20, font: "Arial", color: WHITE })] })] }),
            new TableCell({ borders, width: { size: 6860, type: WidthType.DXA }, shading: { fill: DARK, type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 120 },
              children: [new Paragraph({ children: [new TextRun({ text: "Definisi", bold: true, size: 20, font: "Arial", color: WHITE })] })] }),
          ]}),
          ...[
            ["Canvas", "Area editing interaktif berbasis HTML5 Canvas API tempat foto ditampilkan dan dihias."],
            ["Strip Foto", "Kumpulan 2–8 foto dalam satu layout tunggal yang dihasilkan dari sesi photo booth."],
            ["Frame", "Border dekoratif di sekeliling foto atau seluruh strip."],
            ["Template", "Kombinasi preset frame + filter + elemen dekoratif yang dapat diterapkan sekaligus."],
            ["Render", "Proses menggabungkan semua layer (foto, filter, stiker, teks, frame) menjadi satu file gambar untuk diunduh."],
            ["Free Plan", "Paket gratis dengan akses fitur terbatas."],
            ["Premium Plan", "Paket berbayar dengan akses penuh ke semua fitur eksklusif."],
            ["P0/P1/P2/P3", "Skala prioritas fitur: P0 = wajib ada, P1 = sebaiknya ada, P2 = bagus untuk ada, P3 = masa depan."],
          ].map(([t, d], i) => new TableRow({ children: [
            new TableCell({ borders, width: { size: 2500, type: WidthType.DXA }, shading: { fill: i % 2 === 0 ? PINK_LIGHT : WHITE, type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 120 },
              children: [new Paragraph({ children: [new TextRun({ text: t, bold: true, size: 20, font: "Arial", color: PINK })] })] }),
            new TableCell({ borders, width: { size: 6860, type: WidthType.DXA }, shading: { fill: i % 2 === 0 ? PINK_LIGHT : WHITE, type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 120 },
              children: [new Paragraph({ children: [new TextRun({ text: d, size: 20, font: "Arial", color: DARK })] })] }),
          ]}))
        ]
      }),
      spacer(),
      spacer(),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 240, after: 0 },
        children: [new TextRun({ text: "— Akhir Dokumen —", size: 20, font: "Arial", color: "888888", italics: true })]
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 60, after: 0 },
        children: [new TextRun({ text: "© 2025 Foto·Estetik — Dokumen ini bersifat rahasia dan hanya untuk keperluan internal.", size: 18, font: "Arial", color: "AAAAAA" })]
      }),
    ]
  }]
});

Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync('C:\\Users\\ACER\\pojok-potret\\PRD_Editor_FotoEstetik.docx', buffer);
  console.log('Done!');
});
