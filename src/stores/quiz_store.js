import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from 'axios'

export const useQuizStore = defineStore('quiz', () => {
  const quizzes = ref([])
  const quiz_title = ref([])
  const fetchError = ref(null)
  const isInitialized = ref(false)
  const quiz_map = {}
  const baseUrl = import.meta.env.VITE_API_BASE

  const fetchAllQuizzes = async () => {
    // Simulate an API call with a delay
    //console.log('Simulating API call to fetch quizzes...')
    try {
      const question_api = `${baseUrl}/questions/get_questions.php`
      const quiz_api = `${baseUrl}/quiz/get_quiz.php`

      const questions = await axios.get(question_api)
      quizzes.value = questions.data

      //console.log(quizzes.value)

      const quiz = await axios.get(quiz_api)
      quiz_title.value = quiz.data
      quiz_title.value.reduce((map, quiz_cur) => {
        map[quiz_cur.quiz_id] = quiz_cur.title
        return map
      }, quiz_map)
      isInitialized.value = true
    } catch (err) {
      fetchError.value = '資料載入失敗，請稍後再試'
      //console.error('Fetch 錯誤：', err)
    }
  }

  const counts = computed(() => {
    const tmp = {}
    quizzes.value.forEach((item) => {
      if (!item.quiz_id) return
      tmp[item.quiz_id] = (tmp[item.quiz_id] || 0) + 1
    })
    return tmp
  })

  // 2. Actions: Actions are regular functions that modify the state.
  const addQuestionToQuiz = async (newQuestion) => {
    const quiz = quizzes.value
    if (quiz) {
      const nextId = quiz.length > 0 ? Math.max(...quiz.map((q) => q.question_id)) + 1 : 1
      try {
        const apiUrl = `${baseUrl}/questions/post_questions.php`
        const response = await axios.post(apiUrl, newQuestion)
        //console.log('Quiz created successfully:', response.data)
      } catch (err) {
        //console.error('Post Error:', err)
      }

      // quiz.push({ ...newQuestion, question_id: nextId })
    }
  }

  const deleteQuestionToQuiz = async (row) => {
    const quiz = quizzes.value
    const num_here = counts.value[+row.quiz_id]
    const num_from_quiz = +quiz_title.value[+row.quiz_id - 1].question_num
    //console.log(`num here: ${num_here}`)
    //console.log(`num from quiz: ${num_from_quiz}`)
    if (num_here - 1 < num_from_quiz) {
      return 0
    }

    const q_id = row.question_id
    if (quiz) {
      try {
        const apiUrl = `${baseUrl}/questions/delete_questions.php?question_id=${q_id}`
        const response = await axios.delete(apiUrl)
        //console.log('question deleted successfully:', response.data.result)

        const question_index = quiz.findIndex((q) => q.question_id == q_id)
        if (question_index != -1) quiz.splice(question_index, 1)
        return 1
      } catch (err) {
        //console.error('delete Error:', err)
        return -1
      }
    }
  }

  const editQuestion = async (newQuestion) => {
    const quiz = quizzes.value
    try {
      const apiUrl = `${baseUrl}/questions/patch_questions.php`
      const response = await axios.patch(apiUrl, newQuestion)
      //console.log('Quiz edit successfully:', response.data)
    } catch (err) {
      //console.error('Post Error:', err)
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
    counts,
    addQuestionToQuiz,
    deleteQuestionToQuiz,
    editQuestion,
    fetchAllQuizzes,
  }
})
