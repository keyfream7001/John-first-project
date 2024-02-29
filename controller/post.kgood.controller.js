const pool = require("../database/index")

const postKgoodController = {
    
    getAll: async (req, res) => {
        const limit = 15; // 페이지당 표시할 데이터 수
        const page = parseInt(req.query.page) || 1; // 요청된 페이지 번호, 기본값은 1
        const offset = (page - 1) * limit; // 건너뛸 데이터 수 계산
    
        try {
            // 총 데이터 수 조회
            const [totalRows] = await pool.query("SELECT COUNT(*) AS total FROM k_good");
            const totalCount = totalRows[0].total;
    
            // 데이터 조회
            const [rows] = await pool.query(`
                SELECT * FROM k_good
                ORDER BY uid DESC
                LIMIT ?, ?
            `, [offset, limit]);
    
            res.json({
                data: rows,
                total: totalCount,
                pages: Math.ceil(totalCount / limit), // 총 페이지 수 계산
                currentPage: page
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    getByUid: async (req, res) => {
        try {
            const { gooduid } = req.params
            const [rows, fields] = await pool.query("select * from k_good where uid = ?", [gooduid])
            res.json({
                data: rows
            })
        } catch (error) {
            console.log(error)
        }
    },

    create: async (req, res) => {

        try {
            const {g_name, g_price, g_type1, g_type2, g_etc, g_rank } = req.body
            const sql = "INSERT INTO k_good (g_name, g_etc, g_type1, g_type2, g_price) VALUES (?, ?, ?, ?, ? )";
            const [rows ,fields] = await pool.query(sql, [g_name, g_price, g_type1, g_type2, g_etc, g_rank])
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

    update: async (req, res) => {
        try {
            // URL 파라미터에서 uid 추출
            const { uid } = req.params;
            // 요청 본문에서 업데이트할 데이터를 추출
            const { g_name, g_price, g_type1, g_type2, g_etc } = req.body;
            // uid를 기준으로 k_good 테이블의 해당 레코드를 업데이트하는 SQL 쿼리
            const sql = "UPDATE k_good SET g_name = ?, g_price = ?, g_type1 = ?, g_type2 = ?, g_etc = ? WHERE uid = ?";
            
            // SQL 쿼리 실행
            await pool.query(sql, [g_name, g_price, g_type1, g_type2, g_etc, uid]);
            res.json({
                status: "success",
                message: "Data updated successfully"
            });
        } catch (error) {
            console.log(error);
            res.json({
                status: "error",
                message: "Data update failed"
            });
        }
    },


    delete: async (req, res) => {
        try {
            // URL 파라미터에서 uid 추출
            const { uid } = req.params;
    
            // uid를 WHERE 절의 조건으로 사용하여 특정 열 삭제
            const [result] = await pool.query("DELETE FROM k_good WHERE uid = ?", [uid]);
            
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


    registerProduct: async (req, res) => {
        try {
            // 요청 본문에서 필요한 파라미터 추출
            const { f_code, g_name, g_ea } = req.body;
    
            // 필수 파라미터 존재 여부 및 유효성 검증
            if (!f_code || !g_name || !g_ea) {
                return res.status(400).json({ error: 'f_code, g_name, g_ea 파라미터가 모두 필요합니다.' });
            }
    
            // g_ea 값이 숫자인지 및 양의 정수인지 검증
            if (isNaN(g_ea) || parseInt(g_ea) <= 0) {
                return res.status(400).json({ error: 'g_ea는 양의 정수여야 합니다.' });
            }
    
            // 데이터베이스에서 제품 검색 쿼리
            const selectGoodQuery = 'SELECT * FROM k_good WHERE g_name = ?';
            const [selectGoodResults] = await pool.query(selectGoodQuery, [g_name]);
    
            // 해당 이름을 가진 제품이 데이터베이스에 존재하지 않는 경우 오류 처리
            if (selectGoodResults.length === 0) {
                return res.status(404).json({ error: '선택한 상품을 찾을 수 없습니다.' });
            }
    
            // 검색된 제품 정보 추출
            const goodData = selectGoodResults[0];
            const g_rank = '0'; // g_rank 기본 값 설정
    
            // 제품 등록 쿼리
            const insertQuery = `
                INSERT INTO k_form_good 
                (f_code, g_name, g_price, g_type1, g_type2, g_etc, g_rank, g_ea) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
    
            // 쿼리 실행
            await pool.query(insertQuery, [
                f_code, 
                goodData.g_name, 
                goodData.g_price, 
                goodData.g_type1, 
                goodData.g_type2, 
                goodData.g_etc, 
                g_rank, 
                parseInt(g_ea)
            ]);
    
            // 성공 응답 전송
            res.json({
                message: '상품이 등록되었습니다.',
                redirectURL: `/view?f_code=${f_code}`
            });
        } catch (error) {
            console.error('상품 등록 중 오류 발생:', error);
            res.status(500).json({ error: '상품 등록 중 오류 발생' });
        }
    },


    getByGName: async (req, res) => {
        try {
            const { gName } = req.query; // g_name 값을 쿼리 파라미터에서 받아옵니다.
            const [rows, fields] = await pool.query("SELECT * FROM k_good WHERE g_name = ?", [gName]);
            if (rows.length > 0) {
                res.json({ data: rows[0] }); // 첫 번째 일치하는 상품의 데이터를 반환
            } else {
                res.status(404).json({ error: "해당하는 상품을 찾을 수 없습니다." });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "데이터 조회 중 오류 발생" });
        }
    },


}

module.exports = postKgoodController