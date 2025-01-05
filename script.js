// Fungsi untuk menampilkan tahun dinamis di footer
document.getElementById('currentYear').textContent = new Date().getFullYear();

// Fungsi untuk menghitung tanggal pembebasan
document.getElementById('calculateBtn').addEventListener('click', function () {
  const name = document.getElementById('name').value;
  const lapas = document.getElementById('lapas').value;
  const startDateInput = document.getElementById('startDate').value;
  const years = parseInt(document.getElementById('years').value);
  const months = parseInt(document.getElementById('months').value);
  const subsiderYears = parseInt(document.getElementById('subsiderYears').value) || 0;
  const subsiderMonths = parseInt(document.getElementById('subsiderMonths').value) || 0;
  const remisi17Agustus = parseInt(document.getElementById('remisi17Agustus').value);
  const remisiKeagamaan = parseInt(document.getElementById('remisiKeagamaan').value);
  const remisiDasawarsaInput = document.getElementById('remisiDasawarsa').value; // Input baru

  if (!name || !lapas || !startDateInput || isNaN(years) || isNaN(months) || isNaN(remisi17Agustus) || isNaN(remisiKeagamaan)) {
    alert('Silakan lengkapi semua data wajib.');
    return;
  }

  const startDate = new Date(startDateInput);
  const totalSentenceMonths = years * 12 + months; // Masa pidana pokok dalam bulan
  const subsiderMonthsTotal = subsiderYears * 12 + subsiderMonths; // Masa pidana subsider dalam bulan

  // Hitung total remisi
  let totalRemisi17Agustus = 0;
  let totalRemisiKeagamaan = 0;
  let remisiDasawarsa = 0;

  // Remisi 17 Agustus
  for (let i = 0; i < remisi17Agustus; i++) {
    const hariRemisi = Math.min(i + 1, 6) * 30; // Maksimal 6 bulan (180 hari)
    totalRemisi17Agustus += hariRemisi;
  }

  // Remisi Keagamaan
  for (let i = 0; i < remisiKeagamaan; i++) {
    let hariRemisi = 0;
    if (i === 0) {
      hariRemisi = 15; // Tahun pertama: 15 hari
    } else if (i >= 1 && i <= 2) {
      hariRemisi = 30; // Tahun kedua dan ketiga: 1 bulan
    } else if (i >= 3 && i <= 4) {
      hariRemisi = 45; // Tahun keempat dan kelima: 1 bulan 15 hari
    } else if (i >= 5) {
      hariRemisi = 60; // Tahun keenam dan seterusnya: 2 bulan
    }
    totalRemisiKeagamaan += hariRemisi;
  }

  // Remisi Dasawarsa (hanya dihitung jika pengguna memilih "Ya")
  if (remisiDasawarsaInput === "ya") {
    const startYear = startDate.getFullYear();
    const endYear = startYear + years;
    for (let year = startYear; year <= endYear; year++) {
      if ((year - 1945) % 10 === 0 && year !== 1945) {
        remisiDasawarsa = Math.min(Math.floor(totalSentenceMonths / 12), 3); // 1/12 dari masa pidana, maksimal 3 bulan
        break;
      }
    }
  }

  // Hitung tanggal pembebasan bersyarat (2/3 dari masa pidana pokok dikurangi remisi)
  const twoThirdsSentenceMonths = (totalSentenceMonths * 2) / 3; // 2/3 dari masa pidana pokok
  const releaseDate = new Date(startDate);
  releaseDate.setMonth(startDate.getMonth() + twoThirdsSentenceMonths); // Tambahkan 2/3 masa hukuman pokok
  releaseDate.setDate(releaseDate.getDate() - (totalRemisi17Agustus + totalRemisiKeagamaan)); // Kurangi remisi

  // Hitung tanggal pembebasan setelah subsider
  const releaseDateAfterSubsider = new Date(releaseDate);
  releaseDateAfterSubsider.setMonth(releaseDate.getMonth() + subsiderMonthsTotal);

  // Hitung tanggal pembebasan setelah dikurangi remisi Dasawarsa
  let releaseDateAfterDasawarsaText;
  if (remisiDasawarsaInput === "ya") {
    const releaseDateAfterDasawarsa = new Date(releaseDateAfterSubsider);
    releaseDateAfterDasawarsa.setMonth(releaseDateAfterSubsider.getMonth() - remisiDasawarsa);
    releaseDateAfterDasawarsaText = releaseDateAfterDasawarsa.toLocaleDateString('id-ID');
  } else {
    releaseDateAfterDasawarsaText = "Tidak atau belum mendapatkan Remisi Dasawarsa";
  }

  // Tentukan jenis pembebasan berdasarkan masa pidana
  const isPembebasanBersyarat = totalSentenceMonths > 18; // Lebih dari 1 tahun 6 bulan
  const jenisPembebasan = isPembebasanBersyarat ? "Tanggal Pembebasan Bersyarat" : "Tanggal Cuti Bersyarat";

  // Tampilkan hasil
  const resultDiv = document.getElementById('result');
  resultDiv.innerHTML = `
    <p><strong>Nama Lengkap:</strong> ${name}</p>
    <p><strong>Lapas/Rutan:</strong> ${lapas}</p>
    <p><strong>${jenisPembebasan}:</strong> ${releaseDate.toLocaleDateString('id-ID')}</p>
    <p><strong>Tanggal Pembebasan Setelah Subsider:</strong> ${releaseDateAfterSubsider.toLocaleDateString('id-ID')}</p>
    <p><strong>Tanggal Pembebasan Setelah Dikurangi Remisi Dasawarsa:</strong> ${releaseDateAfterDasawarsaText}</p>
    <p><strong>Total Remisi 17 Agustus:</strong> ${totalRemisi17Agustus} hari</p>
    <p><strong>Total Remisi Keagamaan:</strong> ${totalRemisiKeagamaan} hari</p>
    <p><strong>Remisi Dasawarsa:</strong> ${remisiDasawarsa} bulan ${remisiDasawarsaInput === "tidak" ? "(tidak atau belum mendapatkan Remisi Dasawarsa)" : ""}</p>
  `;
});