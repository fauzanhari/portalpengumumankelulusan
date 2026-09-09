/**
 * PENGUMUMAN KELULUSAN ORIMA 2026 - JAVASCRIPT LOGIC
 * UKM PRIMA UNRAM - KABINET UNI7Y
 */

document.addEventListener('DOMContentLoaded', () => {

    // ----------------------------------------------------------------------
    // 1. EMBEDDED FALLBACK PASSED PARTICIPANTS DATASET (100% Works Offline)
    // ----------------------------------------------------------------------
    const fallbackPassedDatabase = [
        {
            "nomor_pendaftaran": "ORIMA202601",
            "nama": "Budi Santoso",
            "prodi": "Teknik Informatika"
        },
        {
            "nomor_pendaftaran": "ORIMA202602",
            "nama": "Siti Aminah",
            "prodi": "Sistem Informasi"
        },
        {
            "nomor_pendaftaran": "ORIMA202604",
            "nama": "Dewi Lestari",
            "prodi": "Farmasi"
        },
        {
            "nomor_pendaftaran": "ORIMA202606",
            "nama": "Nabila Putri",
            "prodi": "Akuntansi"
        },
        {
            "nomor_pendaftaran": "ORIMA202607",
            "nama": "Muhammad Rizky",
            "prodi": "Manajemen"
        },
        {
            "nomor_pendaftaran": "ORIMA202608",
            "nama": "Ahmad Pratama",
            "prodi": "Teknik Elektro"
        }
    ];

    let passedDatabase = [...fallbackPassedDatabase];
    let lookupDatabase = [];

    // Attempt to load database.json (Kelulusan)
    fetch('database.json')
        .then(response => {
            if (!response.ok) throw new Error("HTTP " + response.status);
            return response.json();
        })
        .then(data => {
            if (Array.isArray(data) && data.length > 0) {
                passedDatabase = data;
                console.log("Database kelulusan ORIMA 2026 berhasil dimuat dari database.json:", data);
            }
        })
        .catch(err => {
            console.warn("Menggunakan database fallback kelulusan (file:// mode):", err.message);
        });

    // Load dataset nomor_pendaftaran_nama_ORIMA_2026.json (Lookup Lupa Nomor)
    function loadLookupData() {
        fetch('nomor_pendaftaran_nama_ORIMA_2026.json')
            .then(res => {
                if (!res.ok) return fetch('../nomor_pendaftaran_nama_ORIMA_2026.json');
                return res;
            })
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data) && data.length > 0) {
                    lookupDatabase = data;
                    console.log("Dataset lookup nomor pendaftaran ORIMA 2026 dimuat:", data.length, "peserta");
                }
            })
            .catch(err => {
                console.warn("Gagal memuat dataset lookup nomor pendaftaran:", err.message);
            });
    }
    loadLookupData();

    // ----------------------------------------------------------------------
    // 2. DOM ELEMENTS SELECTION
    // ----------------------------------------------------------------------
    const introSection = document.getElementById('intro-section');
    const mainApp = document.getElementById('main-app');
    const btnEnter = document.getElementById('btn-enter');

    const searchSection = document.getElementById('search-section');
    const loadingSection = document.getElementById('loading-section');
    const resultSection = document.getElementById('result-section');

    const searchForm = document.getElementById('search-form');
    const nomorInput = document.getElementById('nomor-input');
    const namaInput = document.getElementById('nama-input');

    const btnSubmit = document.getElementById('btn-submit');
    const btnReset = document.getElementById('btn-reset');
    const btnBack = document.getElementById('btn-back');
    const btnPrint = document.getElementById('btn-print');

    const errorMessage = document.getElementById('error-message');
    const errorText = document.getElementById('error-text');

    // Result Elements
    const statusIcon = document.getElementById('status-icon');
    const statusTitle = document.getElementById('status-title');
    const resNomor = document.getElementById('res-nomor');
    const resNama = document.getElementById('res-nama');
    const resProdi = document.getElementById('res-prodi');
    const resStatusBadge = document.getElementById('res-status-badge');
    const resPesan = document.getElementById('res-pesan');

    // Lookup Modal Elements
    const btnForgotNomor = document.getElementById('btn-forgot-nomor');
    const lookupModal = document.getElementById('lookup-modal');
    const btnCloseLookup = document.getElementById('btn-close-lookup');
    const btnCloseLookupFooter = document.getElementById('btn-close-lookup-footer');
    const lookupNameInput = document.getElementById('lookup-name-input');
    const btnClearLookup = document.getElementById('btn-clear-lookup');
    const lookupResultsList = document.getElementById('lookup-results-list');
    const lookupResultsCount = document.getElementById('lookup-results-count');
    const countNumber = document.getElementById('count-number');

    // ----------------------------------------------------------------------
    // 3. INTRO TRANSITION LOGIC
    // ----------------------------------------------------------------------
    btnEnter.addEventListener('click', () => {
        introSection.classList.add('intro-fade-out');
        setTimeout(() => {
            introSection.classList.add('hidden');
            mainApp.classList.remove('hidden');
            nomorInput.focus();
        }, 400);
    });

    // ----------------------------------------------------------------------
    // 4. EVENT LISTENERS
    // ----------------------------------------------------------------------
    searchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        handleSearch();
    });

    btnReset.addEventListener('click', resetForm);

    btnBack.addEventListener('click', () => {
        resultSection.classList.add('hidden');
        searchSection.classList.remove('hidden');
        stopConfetti();
    });

    btnPrint.addEventListener('click', () => {
        window.print();
    });

    nomorInput.addEventListener('input', hideError);
    namaInput.addEventListener('input', hideError);

    // Modal Event Listeners (Lupa Nomor)
    btnForgotNomor.addEventListener('click', openLookupModal);
    btnCloseLookup.addEventListener('click', closeLookupModal);
    btnCloseLookupFooter.addEventListener('click', closeLookupModal);

    lookupModal.addEventListener('click', (e) => {
        if (e.target === lookupModal) {
            closeLookupModal();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !lookupModal.classList.contains('hidden')) {
            closeLookupModal();
        }
    });

    lookupNameInput.addEventListener('input', handleLookupSearch);

    btnClearLookup.addEventListener('click', () => {
        lookupNameInput.value = '';
        btnClearLookup.classList.add('hidden');
        handleLookupSearch();
        lookupNameInput.focus();
    });

    // Event Delegation: Klik "Gunakan Nomor Ini"
    lookupResultsList.addEventListener('click', (e) => {
        const selectBtn = e.target.closest('.btn-select-nomor');
        if (selectBtn) {
            const selectedNomor = selectBtn.getAttribute('data-nomor');
            const selectedNama = selectBtn.getAttribute('data-nama');

            if (selectedNomor && selectedNama) {
                nomorInput.value = selectedNomor;
                namaInput.value = selectedNama;
                hideError();
                closeLookupModal();

                // Highlight animation on input fields
                nomorInput.focus();
                nomorInput.parentElement.classList.add('pulse-highlight');
                setTimeout(() => {
                    nomorInput.parentElement.classList.remove('pulse-highlight');
                }, 1000);
            }
        }
    });

    // ----------------------------------------------------------------------
    // 5. LOOKUP MODAL LOGIC (PENCARIAN NAMA & NOMOR PENDAFTARAN)
    // ----------------------------------------------------------------------
    function openLookupModal() {
        lookupModal.classList.remove('hidden');
        if (lookupDatabase.length === 0) {
            loadLookupData();
        }
        setTimeout(() => {
            lookupNameInput.focus();
        }, 100);
    }

    function closeLookupModal() {
        lookupModal.classList.add('hidden');
    }

    function handleLookupSearch() {
        const query = lookupNameInput.value.trim();

        if (query.length > 0) {
            btnClearLookup.classList.remove('hidden');
        } else {
            btnClearLookup.classList.add('hidden');
        }

        if (query.length < 1) {
            lookupResultsCount.classList.add('hidden');
            lookupResultsList.innerHTML = `
                <div class="empty-state">
                    <i class="fa-solid fa-keyboard empty-icon"></i>
                    <p>Ketikkan nama Anda di atas untuk menampilkan nomor pendaftaran.</p>
                </div>
            `;
            return;
        }

        const cleanQuery = query.toLowerCase();
        const matches = lookupDatabase.filter(item => {
            const namaClean = (item.nama || '').toLowerCase();
            return namaClean.includes(cleanQuery);
        });

        renderLookupResults(matches, query);
    }

    function renderLookupResults(matches, query) {
        if (matches.length === 0) {
            lookupResultsCount.classList.add('hidden');
            lookupResultsList.innerHTML = `
                <div class="empty-state">
                    <i class="fa-solid fa-user-slash empty-icon"></i>
                    <p>Nama <strong>"${escapeHtml(query)}"</strong> tidak ditemukan dalam daftar peserta.</p>
                    <small style="color: var(--text-muted);">Pastikan ejaan nama sudah sesuai dengan yang didaftarkan.</small>
                </div>
            `;
            return;
        }

        // Tampilkan badge jumlah hasil
        countNumber.textContent = matches.length;
        lookupResultsCount.classList.remove('hidden');

        // Tampilkan maksimal 50 hasil terbaik agar performa tetep cepat
        const displayLimit = 50;
        const slicedMatches = matches.slice(0, displayLimit);

        let html = slicedMatches.map(item => {
            const highlightedNama = highlightMatch(item.nama, query);
            return `
                <div class="lookup-item">
                    <div class="lookup-info">
                        <span class="lookup-name">${highlightedNama}</span>
                        <span class="lookup-nomor-badge">
                            <i class="fa-solid fa-id-card"></i> ${escapeHtml(item.nomor_pendaftaran)}
                        </span>
                    </div>
                    <button type="button" class="btn-select-nomor" data-nomor="${escapeHtml(item.nomor_pendaftaran)}" data-nama="${escapeHtml(item.nama)}">
                        <i class="fa-solid fa-circle-check"></i> Gunakan
                    </button>
                </div>
            `;
        }).join('');

        if (matches.length > displayLimit) {
            html += `
                <div style="text-align: center; font-size: 0.78rem; color: var(--text-muted); padding: 8px;">
                    Menampilkan ${displayLimit} dari ${matches.length} hasil. Ketikkan nama lebih spesifik.
                </div>
            `;
        }

        lookupResultsList.innerHTML = html;
    }

    function highlightMatch(text, query) {
        if (!query) return escapeHtml(text);
        const safeText = escapeHtml(text);
        const safeQuery = escapeHtml(query);
        const regex = new RegExp(`(${safeQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
        return safeText.replace(regex, '<mark style="background: rgba(251, 191, 36, 0.35); color: #fbbf24; border-radius: 2px; padding: 0 2px;">$1</mark>');
    }

    function escapeHtml(str) {
        if (!str) return '';
        return String(str)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }
    function handleSearch() {
        const nomorVal = nomorInput.value.trim();
        const namaVal = namaInput.value.trim();

        if (!nomorVal || !namaVal) {
            showError("Harap masukkan Nomor Pendaftaran dan Nama Lengkap!");
            return;
        }

        hideError();

        // Tampilkan loading sebentar
        searchSection.classList.add('hidden');
        loadingSection.classList.remove('hidden');

        setTimeout(() => {
            loadingSection.classList.add('hidden');
            checkGraduationStatus(nomorVal, namaVal);
        }, 600);
    }

    function checkGraduationStatus(inputNomor, inputNama) {
        const cleanNomor = inputNomor.toLowerCase();
        const cleanNama = inputNama.toLowerCase();

        // Cari di database (Hanya peserta yang ada di JSON = LULUS)
        const matchedCandidate = passedDatabase.find(item => {
            const matchNomor = item.nomor_pendaftaran.toString().toLowerCase() === cleanNomor;
            const matchNama = item.nama.toString().toLowerCase() === cleanNama;
            return matchNomor && matchNama;
        });

        if (matchedCandidate) {
            // DATA ADA DI JSON -> OTOMATIS LULUS (LAYAR HIJAU)
            renderLulus(matchedCandidate);
        } else {
            // DATA TIDAK ADA DI JSON -> OTOMATIS TIDAK LULUS (LAYAR MERAH)
            renderTidakLulus(inputNomor, inputNama);
        }
    }

    // ----------------------------------------------------------------------
    // 6. RESULT RENDERING FUNCTIONS
    // ----------------------------------------------------------------------

    // LAYAR HIJAU (LULUS)
    function renderLulus(candidate) {
        resultSection.classList.remove('hidden');
        resultSection.classList.remove('state-gagal');
        resultSection.classList.add('state-lulus');

        statusIcon.className = "fa-solid fa-circle-check";
        statusTitle.textContent = "SELAMAT! ANDA DINYATAKAN LULUS";

        resNomor.textContent = candidate.nomor_pendaftaran;
        resNama.textContent = candidate.nama;
        resProdi.textContent = candidate.prodi || "-";
        
        resStatusBadge.textContent = "LULUS";
        resStatusBadge.className = "badge badge-success";

        resPesan.textContent = "Selamat atas kelulusan Anda dalam Seleksi Open Recruitment ORIMA 2026 UKM PRIMA UNRAM (Kabinet UNI7Y)! Perjuangan dan dedikasi Anda telah membuahkan hasil. Teruslah mengeksplorasi cipta karya, leadership, dan inovasi bersama UKM PRIMA.";

        // Jalankan selebrasi konfeti
        startConfetti();
    }

    // LAYAR MERAH (TIDAK LULUS)
    function renderTidakLulus(nomor, nama) {
        resultSection.classList.remove('hidden');
        resultSection.classList.remove('state-lulus');
        resultSection.classList.add('state-gagal');

        statusIcon.className = "fa-solid fa-circle-xmark";
        statusTitle.textContent = "MOHON MAAF, ANDA DINYATAKAN TIDAK LULUS";

        resNomor.textContent = nomor;
        resNama.textContent = nama;
        resProdi.textContent = "-";

        resStatusBadge.textContent = "TIDAK LULUS";
        resStatusBadge.className = "badge badge-danger";

        resPesan.textContent = "Mohon maaf, data pendaftaran Anda tidak tercantum dalam daftar kelulusan Open Recruitment ORIMA 2026 UKM PRIMA UNRAM. Terima kasih atas partisipasi dan semangat luar biasa yang telah Anda tunjukkan. Jangan berkecil hati, kegagalan adalah awal dari keberhasilan. Tetap semangat dan terus berkarya! | see u in next ORIMA 2027 !!";

        stopConfetti();
    }

    function resetForm() {
        nomorInput.value = '';
        namaInput.value = '';
        hideError();
        nomorInput.focus();
    }

    function showError(msg) {
        errorText.textContent = msg;
        errorMessage.classList.remove('hidden');
    }

    function hideError() {
        errorMessage.classList.add('hidden');
    }

    // ----------------------------------------------------------------------
    // 7. ANIMASI KONFETI CANVAS (SELEBRASI LULUS)
    // ----------------------------------------------------------------------
    const canvas = document.getElementById('confetti-canvas');
    const ctx = canvas.getContext('2d');
    let confettiParticles = [];
    let animationFrameId = null;

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    function createConfetti() {
        const colors = ['#10b981', '#34d399', '#fbbf24', '#ec4899', '#a855f7', '#ffffff'];
        confettiParticles = [];
        for (let i = 0; i < 140; i++) {
            confettiParticles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height - canvas.height,
                size: Math.random() * 8 + 4,
                color: colors[Math.floor(Math.random() * colors.length)],
                speedY: Math.random() * 3 + 2,
                speedX: Math.random() * 2 - 1,
                rotation: Math.random() * 360,
                rotationSpeed: Math.random() * 6 - 3
            });
        }
    }

    function updateAndDrawConfetti() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        confettiParticles.forEach((p) => {
            p.y += p.speedY;
            p.x += p.speedX;
            p.rotation += p.rotationSpeed;

            if (p.y > canvas.height) {
                p.y = -10;
                p.x = Math.random() * canvas.width;
            }

            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate((p.rotation * Math.PI) / 180);
            ctx.fillStyle = p.color;
            ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
            ctx.restore();
        });

        animationFrameId = requestAnimationFrame(updateAndDrawConfetti);
    }

    function startConfetti() {
        stopConfetti();
        createConfetti();
        updateAndDrawConfetti();
    }

    function stopConfetti() {
        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
            animationFrameId = null;
        }
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

});
