const pool = require("../database/index")

const postsKformController = {
    
    getAll: async (req, res) => {
        try {
            const limit = 15; // 페이지당 표시할 데이터 수
            const page = req.query.page || 1; // 요청된 페이지 번호, 기본값은 1
            const offset = (page - 1) * limit; // 건너뛸 데이터 수 계산
    
            // 총 데이터 수 조회
            const [totalRows] = await pool.query("SELECT COUNT(*) AS total FROM k_form");
            const totalCount = totalRows[0].total;
    
            // uid 기준 내림차순 정렬하여 데이터 조회
            const [rows] = await pool.query(`
                SELECT * FROM k_form
                ORDER BY uid DESC
                LIMIT ?, ?
            `, [offset, limit]);
    
            res.json({
                data: rows,
                total: totalCount,
                pages: Math.ceil(totalCount / limit) // 총 페이지 수 계산
            });
        } catch (error) {
            console.log(error);
        }
    },

    getByFcode: async (req, res) => {
        try {
            const { kformfcode } = req.params;
            // 첫 번째 쿼리: k_form에서 f_code에 해당하는 데이터 조회
            const [kFormRows] = await pool.query("SELECT * FROM k_form WHERE f_code = ?", [kformfcode]);
    
            if (kFormRows.length === 0) {
                return res.status(404).json({ message: "Data not found" });
            }
    
            const promises = kFormRows.map(async (row) => {
                // k_config 데이터 조회
                const [kConfigRows] = await pool.query("SELECT * FROM k_config WHERE uid = ?", [row.f_gong]);
                
                // k_form_good 데이터 조회
                const [kFormGoodRows] = await pool.query("SELECT * FROM k_form_good WHERE f_code = ?", [row.f_code]);
    
                // k_good의 모든 데이터 조회
                const [kGoodRows] = await pool.query("SELECT * FROM k_good");
                console.log(kFormRows)
                return {
                    kForm: row,
                    kConfig: kConfigRows, // 여러 결과가 있을 수 있음
                    kFormGood: kFormGoodRows, // 여러 결과가 있을 수 있음
                    kGood: kGoodRows // 추가된 부분: k_good 테이블의 모든 데이터
                };
            });
    
            const data = await Promise.all(promises);
    
            res.json({ data });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: "Internal Server Error" });
        }
    },

    update: async (req, res) => {
        try {
            const { f_code } = req.params;
            const { f_cname, f_damdang, f_tel, f_date, f_title, f_cmt } = req.body;
            const sql = "UPDATE k_form SET f_cname = ?, f_damdang = ?, f_tel = ?, f_date = ?, f_title = ?, f_cmt = ? WHERE f_code = ?";
            const [rows] = await pool.query(sql, [f_cname, f_damdang, f_tel, f_date, f_title, f_cmt, f_code]);
    
            if (rows.affectedRows > 0) {
                res.json({
                    status: "success",
                    message: " 성공적으로 업데이트되었습니다.",
                    data: rows
                });
            } else {
                res.status(404).json({
                    status: "error",
                    message: "업데이트할 데이터를 찾을 수 없습니다."
                });
            }
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
            const { kformfcode } = req.params;
            // 올바른 SQL 키워드로 수정: DELECT -> DELETE
            const [result] = await pool.query("DELETE FROM k_form WHERE f_code = ?", [kformfcode]);
    
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

    create: async (req, res) => {
        const getLastFCodeQuery = 'SELECT f_code FROM k_form ORDER BY f_code DESC LIMIT 1';
    
        try {
            // 가장 최근의 f_code 값을 조회합니다.
            const [lastFCodeResult] = await pool.query(getLastFCodeQuery);
            let newFCode = 1; // 기본값 설정
            if (lastFCodeResult.length > 0) {
                newFCode = parseInt(lastFCodeResult[0].f_code, 10) + 1;
            }
    
            // 'configSelect'에서 선택된 'c_cname'의 'uid' 값을 'f_gong'에 할당합니다.
            const f_gong = req.body.configSelect; // 수정된 부분
    
            // 요청 본문에서 필요한 나머지 값들을 추출합니다.
            const { f_cname, f_damdang, f_tel, f_type, f_date, f_title, f_cmt } = req.body;
    
            // 새로운 데이터를 삽입합니다.
            const sql = "INSERT INTO k_form (f_code, f_gong, f_cname, f_damdang, f_tel, f_type, f_date, f_title, f_cmt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
            await pool.query(sql, [newFCode, f_gong, f_cname, f_damdang, f_tel, f_type, f_date, f_title, f_cmt]);
    
            // 데이터 삽입 후, 생성된 f_code를 기반으로 리다이렉션합니다.
            res.redirect(`/view?f_code=${newFCode}`);
        } catch (error) {
            console.log(error);
            res.status(500).json({
                status: "error",
                message: error.message
            });
        }
    },
    
    

}


module.exports = postsKformController