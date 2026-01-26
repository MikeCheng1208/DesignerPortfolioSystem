export default defineEventHandler(async (event) => {  
  try {  
    const result = await testConnection()  
    return {  
      success: result,  
      message: result ? '✅ 資料庫連線成功' : '❌ 資料庫連線失敗'  
    }  
  } catch (error) {  
    return {  
      success: false,  
      message: `❌ 錯誤: ${error.message}`  
    }  
  }  
})  
