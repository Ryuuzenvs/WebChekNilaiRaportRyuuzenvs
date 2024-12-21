document.addEventListener("DOMContentLoaded", () => {
    const tableContainer = document.getElementById("table-container");
    const addTableButton = document.getElementById("add-table");
    const checkScoreButton = document.getElementById("check-score");
    const resetButton = document.getElementById("reset");
    const resultSection = document.getElementById("result-section");
    const avgScoreElement = document.getElementById("avg-score");
    const comparisonPercentageElement = document.getElementById("comparison-percentage");
    const banner = document.getElementById("banner");
    const topPercentageElement = document.getElementById("top-percentage");

    let tableCount = 1;

    // Nilai rata-rata nasional dan batas peringkat
    const nationalAverage = 800; // Rata-rata nasional total nilai dari 10 mapel
    const thresholds = {
        "5%": 900,  // Top 5%
        "6%": 890, //top 6%
        "7%": 880, //top 7%
        "8%": 870, //top 8%
        "9%" : 860, //top 9%
        "10%": 850, // Top 10%
        "15%": 800, // Top 15%
        "20%": 750, // Top 20%
        "25%": 700, // Top 25%
        "30%": 650, // Top 30%
        "35%": 600, // Top 35%
        "40%": 550, // Top 40%
    };
    const kurikulumMapel = [
        "Agama", "Pendidikan Kewarganegaraan", "Matematika", "Bahasa Indonesia", "Bahasa Inggris",
        "Ilmu Pengetahuan Alam", "Ilmu Pengetahuan Sosial", "Seni Budaya", "Penjaskes","kedaerahan"
    ];

    // Membuat tabel pertama dengan dropdown mapel
    function createTable(id) {
        const table = document.createElement("table");
        table.id = `table${id}`;
        table.innerHTML = `
            <tr>
                <th>Mapel</th>
                <th>Nilai Akademik</th>
            </tr>
            <tr>
                <td>
                    <select id="mapel${id}">
                        ${kurikulumMapel.map(mapel => `<option value="${mapel}">${mapel}</option>`).join("")}
                    </select>
                </td>
                <td>
                    <input type="number" id="nilai${id}" placeholder="Nilai (dari -100 ke 100)" min="-100" max="100">
                </td>
            </tr>
        `;
        return table;
    }

    // Add input validation for Nama Mapel and Nilai Akademik
tableContainer.addEventListener("input", (event) => {
    const target = event.target;
    if (target.id.includes("mapel")) {
        target.value = target.value.replace(/[^a-zA-Z ]/g, ""); // Allow only letters and spaces
    } else if (target.id.includes("nilai")) {
        const value = parseInt(target.value, 10);
        if (value < -100 || value > 100) {
            target.value = ""; // Clear invalid input
            alert("Nilai hanya boleh di antara -100 hingga 100.");
        }
    }
});

    // Tambahkan tabel pertama saat memuat halaman
    tableContainer.appendChild(createTable(1));

    // Event untuk menambah mapel baru
    addTableButton.addEventListener("click", () => {
        tableCount++;
        tableContainer.appendChild(createTable(tableCount));
    });

    // Fungsi untuk menghitung rata-rata dan menentukan ranking
    checkScoreButton.addEventListener("click", () => {
        let total = 0;
        let count = 0;

        for (let i = 1; i <= tableCount; i++) {
            const nilaiInput = document.getElementById(`nilai${i}`);
            if (nilaiInput && nilaiInput.value) {
                total += parseFloat(nilaiInput.value);
                count++;
            }
        }

        // Validasi jumlah mapel minimal sesuai kurikulum
        if (count < 8) {
            alert("Jumlah mapel minimal adalah 8 mata pelajaran!");
            return;
        }

        const avg = total / count;
        avgScoreElement.textContent = avg.toFixed(2);

        // Hitung skor total dan bandingkan dengan peringkat nasional
        const totalScore = avg * count;
        let rankingText = "Tidak Masuk Top";
        for (const [key, value] of Object.entries(thresholds)) {
            if (totalScore >= value) {
                rankingText = key;
                break;
            }
        }

        comparisonPercentageElement.textContent = `Skor Total: ${totalScore.toFixed(2)}`;
        topPercentageElement.textContent = rankingText;

        // Hebohkan teks jika masuk ranking
        if (rankingText !== "Tidak Masuk Top") {
            banner.innerHTML = `<h3 style="font-size: 2rem; color: red; animation: popIn 1s;">Anda Termasuk Top ${rankingText}</h3>`;
        } else {
            banner.innerHTML = `<h3 style="color: gray;">Anda Tidak Masuk Top</h3>`;
        }

        banner.classList.remove("hidden");
        resultSection.classList.remove("hidden");
    });

    // Reset semua data
    resetButton.addEventListener("click", () => {
        tableContainer.innerHTML = "";
        tableContainer.appendChild(createTable(1));
        tableCount = 1;
        resultSection.classList.add("hidden");
    });
});

// Animasi masuk teks
const style = document.createElement("style");
style.innerHTML = `
    @keyframes popIn {
        0% { transform: scale(0); opacity: 0; }
        100% { transform: scale(1); opacity: 1; }
    }
`;
document.head.appendChild(style);

// Fungsi untuk mendeteksi posisi dropdown
function adjustDropdownPosition() {
    const selects = document.querySelectorAll("select"); // Semua dropdown

    selects.forEach((select) => {
        const dropdown = select;
        const rect = dropdown.getBoundingClientRect(); // Posisi elemen di layar
        const windowHeight = window.innerHeight; // Tinggi layar

        // Jika posisi dropdown terlalu dekat dengan bagian bawah layar
        if (rect.bottom > windowHeight - 10) {
            dropdown.classList.add("top"); // Tambahkan class untuk posisi ke atas
        } else {
            dropdown.classList.remove("top"); // Hapus class jika posisi normal
        }
    });
}

// Panggil fungsi setiap kali layar di-scroll atau di-resize
window.addEventListener("scroll", adjustDropdownPosition);
window.addEventListener("resize", adjustDropdownPosition);

// Jalankan juga saat halaman selesai dimuat
document.addEventListener("DOMContentLoaded", adjustDropdownPosition);
