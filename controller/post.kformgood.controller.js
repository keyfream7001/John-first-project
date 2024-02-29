const pool = require("../database/index")

const postKformgoodController = {
    
    getAll: async (req, res) => {
        try {
            const [rows, fields] = await pool.query("select * from k_form_good")
            res.json({
                data: rows
            })
        } catch (error) {
            console.log(error)
        }
    },
    getByFcode: async (req, res) => {
        try {
            const { goodfcode } = req.params
            const [rows, fields] = await pool.query("select * from k_form_good where f_code = ?", [goodfcode])
            res.json({
                data: rows
            })
        } catch (error) {
            console.log(error)
        }
    },
 
    create: async (req, res) => {
        try {
            // 요청 본문에서 f_code 값을 추출합니다. (수정된 부분)
            const { f_code, g_name, g_ea, g_price, g_type1, g_type2, g_etc, g_rank } = req.body;
    
            // 요청 본문에서 받은 데이터를 사용하여 INSERT 쿼리를 실행합니다.
            const sql = "INSERT INTO k_form_good (f_code, g_name, g_ea, g_etc, g_type1, g_type2, g_price, g_rank) VALUES (?, ?, ?, ?, ?, ?, ?, 1)";
            await pool.query(sql, [f_code, g_name, g_ea, g_etc, g_type1, g_type2, g_price, g_rank]);
    
            // 데이터 삽입 후, f_code 값을 포함하여 리다이렉션할 페이지로 이동합니다.
            res.redirect(`/view?f_code=${f_code}`);
        } catch (error) {
            console.log(error);
            res.status(500).json({
                status: "error",
                message: error.message
            });
        }
    },
    
// 수정필요
update: async (req, res) => {
    try {
        // URL 파라미터에서 uid 추출
        const { uid } = req.params; // f_code 대신 uid를 사용
        // 업데이트할 필드값들
        const { g_name, g_ea, g_price, g_type1, g_type2, g_etc, g_rank } = req.body;
        // uid를 WHERE 절의 조건으로 사용하여 특정 열 업데이트
        const sql = "UPDATE k_form_good SET g_name = ?, g_ea = ?, g_price = ?, g_type1 = ?, g_type2 = ?, g_etc = ?, g_rank = ? WHERE uid = ?";
        // 쿼리 실행
        const [rows] = await pool.query(sql, [g_name, g_ea, g_price, g_type1, g_type2, g_etc, g_rank, uid]);
        res.json({
            data: rows
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: "error",
            message: "데이터 업데이트 중 오류가 발생했습니다."
        });
    }
},

    delete: async (req, res) => {
        try {
            // URL 파라미터에서 uid 추출
            const { uid } = req.params;
    
            // uid를 WHERE 절의 조건으로 사용하여 특정 열 삭제
            const [result] = await pool.query("DELETE FROM k_form_good WHERE uid = ?", [uid]);
            
            // 삭제된 행의 수를 확인합니다.
            if (result.affectedRows === 0) {
                return res.status(404).json({ message: "Data not found" });
            }
            
            // 성공적으로 데이터를 삭제했을 경우의 응답을 추가합니다.
            res.status(200).json({ message: "Data deleted successfully" });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: "Internal Server Error" });
        }
    },
    
    
}
    

module.exports = postKformgoodController