'use strict';

var response = require('./res');
var connection = require('./koneksi');

exports.index = function(req, res){
    response.ok("Aplikasi REST API ku berjalan!", res);
}

//menampilkan semua data mahasiswa (done)
exports.tampilsemuamahasiswa = function(req, res){
    connection.query('SELECT * FROM mahasiswa', function(error, rows, fields){
        if(error){
            console.log(error);
        }else {
            response.ok(rows,res);
        }
    });
};

//menampilkan data mahasiswa berdasarkan id (done)
exports.tampilberdasarkanid = function(req, res){
    let id = req.params.id;
    connection.query('SELECT * FROM mahasiswa WHERE id_mahasiswa = ?', [id], function(error, rows, fields){
        if(error){
            console.log(error);
        }else {
            if (rows.length === 0) {
                return res.status(404).json({
                    status: 'fail',
                    message: 'Mahasiswa tidak ditemukan',
                });
            }
            response.ok(rows,res);
        }
    });
};

//menambahkan data mahasiswa (done)
exports.tambahdataMahasiswa = function(req, res){
    var nim = req.body.nim;
    var nama = req.body.nama;
    var jurusan = req.body.jurusan;

    //Validasi apakah properti 'nim' dan 'nama' ada pada request body
    if (!nim || !nama) {
        const response = {
            status: 'fail',
            message: 'Gagal menambahkan data mahasiswa. Mohon isi nim dan nama mahasiswa!',
        };
        res.status(400).json(response);
        return;
    }

    connection.query('INSERT INTO mahasiswa (nim,nama,jurusan) VALUES(?,?,?)', 
    [nim, nama, jurusan], function(error, rows, fields){
        if(error){
            console.log(error);
        }else {
            const successResponse = {
                status: 'success',
                message: 'Data mahasiswa berhasil ditambahkan',
            };
            res.status(201).json(successResponse);
        }
    });
};

//mengubah data berdasarkan id
exports.ubahdataMahasiswa = function(req, res){
    var id = req.params.id;
    var nim = req.body.nim;
    var nama = req.body.nama;
    var jurusan = req.body.jurusan;

    // Validasi properti nim dan nama
    if (!nim || !nama) {
        const failResponse = {
            status: 'fail',
            message: 'Gagal memperbarui data mahasiswa. Mohon isi nim dan nama mahasiswa!',
        };
        return res.status(400).json(failResponse);
    }

    connection.query('UPDATE mahasiswa SET nim=?, nama=?, jurusan=? WHERE id_mahasiswa=?', 
    [nim, nama, jurusan, id], function(error, rows, fields){
        if(error){
            console.log(error);
        }else {
            // Jika query berhasil tapi tidak ada data yang terpengaruh, kembalikan respons 404
            if (rows.affectedRows === 0) {
                const notFoundResponse = {
                    status: 'fail',
                    message: 'Gagal memperbarui data mahasiswa. Id tidak ditemukan',
                };
                return res.status(404).json(notFoundResponse);
            }
            
            // Jika berhasil, kembalikan respons success
            const successResponse = {
                status: 'success',
                message: 'Data mahasiswa berhasil diubah',
            };
            return res.status(200).json(successResponse);
        }
    });
};

//menghapus data berdasarkan id
exports.hapusdataMahasiswa = function(req, res){
    var id = req.params.id;
    connection.query('DELETE FROM mahasiswa WHERE id_mahasiswa=?', [id], function(error, rows, fields){
        if(error){
            console.log(error);
        }else {
            // Jika query berhasil tapi tidak ada data yang terpengaruh, kembalikan respons 404
            if (rows.affectedRows === 0) {
                const notFoundResponse = {
                    status: 'fail',
                    message: 'Gagal menghapus data mahasiswa. Id tidak ditemukan',
                };
                return res.status(404).json(notFoundResponse);
            }
            
            // Jika berhasil, kembalikan respons success
            const successResponse = {
                status: 'success',
                message: 'Data mahasiswa berhasil dihapus',
            };
            return res.status(200).json(successResponse);
        }
    });
};