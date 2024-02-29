const pool = require("../database/index")

const postsConfigController = {
    
    getAll: async (req, res) => {
        try {
            const [rows, fields] = await pool.query("select * from k_config")
            res.json({
                data: rows
            })
        } catch (error) {
            console.log(error)
        }
    },
    getByuid: async (req, res) => {
        try {
            const { configuid } = req.params
            const [rows, fields] = await pool.query("select * from k_config where f_code = ?", [configuid])
            res.json({
                data: rows
            })
        } catch (error) {
            console.log(error)
        }
    },
 
    create: async (req, res) => {

        try {
            const {c_sa, c_cname, c_ceo, c_tel, c_fax, c_addr, c_type1, c_type2, c_dojang, c_logo, c_footer, c_footer2, c_footer3, k_title, k_desc, k_img } = req.body
            const sql = "INSERT INTO k_config (c_sa, c_cname, c_ceo, c_tel, c_fax, c_addr, c_type1, c_type2, c_dojang, c_logo, c_footer, c_footer2, c_footer3, k_title, k_desc, k_img) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ? )";
            const [rows ,fields] = await pool.query(sql, [c_sa, c_cname, c_ceo, c_tel, c_fax, c_addr, c_type1, c_type2, c_dojang, c_logo, c_footer, c_footer2, c_footer3, k_title, k_desc, k_img])
            res.json({
                data: rows
            })
        } catch (error) {
            console.log(error)
            res.json({
                status:"error"
            })
        }
    },
    
}

module.exports = postsConfigController