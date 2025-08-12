import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from 'axios'

export const useQuizStore = defineStore('quiz', () => {
  const quizzes = ref([])
  const quiz_title = ref([])
  const fetchError = ref(null)
  const isInitialized = ref(false)
  const quiz_map = {}

  const fetchAllQuizzes = async () => {
    // Simulate an API call with a delay
    console.log('Simulating API call to fetch quizzes...')
    try {
      const apiUrl = 'http://localhost:8888/php/api/questions/get_questions.php'
      const response = await axios.get(apiUrl)
      quizzes.value = response.data.questions
      quiz_title.value = response.data.quiz_title
      quiz_title.value.reduce((map, quiz_cur) => {
        map[quiz_cur.quiz_id] = quiz_cur.title
        return map
      }, quiz_map)
      isInitialized.value = true
    } catch (err) {
      fetchError.value = '資料載入失敗，請稍後再試'
      console.error('Fetch 錯誤：', err)
    }
  }

  // 2. Actions: Actions are regular functions that modify the state.
  const addQuestionToQuiz = async (newQuestion) => {
    const quiz = quizzes.value
    if (quiz) {
      const nextId = quiz.length > 0 ? Math.max(...quiz.map((q) => q.question_id)) + 1 : 1
      try {
        const apiUrl = 'http://localhost:8888/php/api/questions/post_questions.php'
        const response = await axios.post(apiUrl, newQuestion)
        console.log('Quiz created successfully:', response.data)
      } catch (err) {
        console.error('Post Error:', err)
      }

      // quiz.push({ ...newQuestion, question_id: nextId })
    }
  }

  const deleteQuestionToQuiz = async (q_id) => {
    const quiz = quizzes.value
    if (quiz) {
      try {
        const apiUrl = `http://localhost:8888/php/api/questions/delete_questions.php?question_id=${q_id}`
        const response = await axios.delete(apiUrl)
        console.log('question deleted successfully:', response.data.result)

        const question_index = quiz.findIndex((q) => q.question_id == q_id)
        if (question_index != -1) quiz.splice(question_index, 1)
      } catch (err) {
        console.error('delete Error:', err)
      }
    }
  }

  const editQuestion = async (newQuestion) => {
    const quiz = quizzes.value
    try {
      const apiUrl = 'http://localhost:8888/php/api/questions/patch_questions.php'
      const response = await axios.patch(apiUrl, newQuestion)
      console.log('Quiz edit successfully:', response.data)
    } catch (err) {
      console.error('Post Error:', err)
    }
    // const question = quiz.find((q) => q.question_id == newQuestion.question_id)
    // if (question) {
    //   Object.assign(question, newQuestion)
    // }
  }

  return {
    quizzes,
    fetchError,
    isInitialized,
    quiz_map,
    addQuestionToQuiz,
    deleteQuestionToQuiz,
    editQuestion,
    fetchAllQuizzes,
  }
})
