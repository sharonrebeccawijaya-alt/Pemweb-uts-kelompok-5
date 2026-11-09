
const Supplier = require('../models/supplierModel');

// Validasi input supplier
const validateSupplier = (data) => {
    const errors = [];

    if (!data.nama || !data.nama.trim()) {
        errors.push('Nama supplier wajib diisi.');
    }

    if (!data.telepon || !data.telepon.trim()) {
        errors.push('Nomor telepon wajib diisi.');
    }

    if (!data.email || !data.email.trim()) {
        errors.push('Email wajib diisi.');
    } else {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(data.email.trim())) {
            errors.push('Format email tidak valid.');
        }
    }

    if (!data.alamat || !data.alamat.trim()) {
        errors.push('Alamat supplier wajib diisi.');
    }

    return errors;
};

// Menampilkan seluruh supplier
exports.index = async (req, res) => {
    try {
        const suppliers = await Supplier.getAll();

        res.render('supplier/index', {
            title: 'Data Supplier',
            suppliers,
            message: req.query.message || '',
            error: req.query.error || ''
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Gagal mengambil data supplier.');
    }
};

// Menampilkan form tambah
exports.createForm = (req, res) => {
    res.render('supplier/form', {
        title: 'Tambah Supplier',
        supplier: {},
        errors: []
    });
};

// Menyimpan supplier baru
exports.store = async (req, res) => {
    try {
        const data = {
            nama: (req.body.nama || '').trim(),
            telepon: (req.body.telepon || '').trim(),
            email: (req.body.email || '').trim(),
            alamat: (req.body.alamat || '').trim()
        };

        const errors = validateSupplier(data);

        if (errors.length > 0) {
            return res.status(400).render('supplier/form', {
                title: 'Tambah Supplier',
                supplier: data,
                errors
            });
        }

        await Supplier.create(data);

        res.redirect('/supplier?message=Supplier berhasil ditambahkan');
    } catch (error) {
        console.error(error);

        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).render('supplier/form', {
                title: 'Tambah Supplier',
                supplier: req.body,
                errors: ['Email supplier sudah terdaftar.']
            });
        }

        res.status(500).send('Gagal menambahkan supplier.');
    }
};

// Menampilkan form edit
exports.editForm = async (req, res) => {
    try {
        const supplier = await Supplier.getById(req.params.id);

        if (!supplier) {
            return res.status(404).send('Supplier tidak ditemukan.');
        }

        res.render('supplier/form', {
            title: 'Edit Supplier',
            supplier,
            errors: []
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Gagal mengambil data supplier.');
    }
};

// Memperbarui supplier
exports.update = async (req, res) => {
    try {
        const id = req.params.id;
        const supplier = await Supplier.getById(id);

        if (!supplier) {
            return res.status(404).send('Supplier tidak ditemukan.');
        }

        const data = {
            nama: (req.body.nama || '').trim(),
            telepon: (req.body.telepon || '').trim(),
            email: (req.body.email || '').trim(),
            alamat: (req.body.alamat || '').trim()
        };

        const errors = validateSupplier(data);

        if (errors.length > 0) {
            return res.status(400).render('supplier/form', {
                title: 'Edit Supplier',
                supplier: { ...data, id },
                errors
            });
        }

        await Supplier.update(id, data);

        res.redirect('/supplier?message=Supplier berhasil diperbarui');
    } catch (error) {
        console.error(error);

        if (error.code === 'ER_DUP_ENTRY') {
            const supplier = {
                ...req.body,
                id: req.params.id
            };

            return res.status(400).render('supplier/form', {
                title: 'Edit Supplier',
                supplier,
                errors: ['Email supplier sudah digunakan.']
            });
        }

        res.status(500).send('Gagal memperbarui supplier.');
    }
};

// Menghapus supplier
exports.destroy = async (req, res) => {
    try {
        const id = req.params.id;

        const supplier = await Supplier.getById(id);

        if (!supplier) {
            return res.redirect(
                '/supplier?error=Supplier tidak ditemukan'
            );
        }

        const used = await Supplier.isUsed(id);

        if (used) {
            return res.redirect(
                '/supplier?error=Supplier masih digunakan oleh data barang'
            );
        }

        await Supplier.remove(id);

        res.redirect('/supplier?message=Supplier berhasil dihapus');
    } catch (error) {
        console.error(error);
        res.redirect('/supplier?error=Gagal menghapus supplier');
    }
};
