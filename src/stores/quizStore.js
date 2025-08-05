import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

// Define the store using the Composition API style.
// The first argument is the store's ID, which must be unique.
export const useQuizStore = defineStore('quiz', () => {
  // 1. State: Use `ref()` for reactive state properties.
  //    This replaces the `state: () => ({ ... })` option.
  const quizzes = ref([
    {
      question_id: 1,
      quiz_id: 1,
      question_description: '氣候變遷如何威脅綠蠵龜的族群平衡？',
      option_1: '改變其覓食地點',
      option_2: '增加牠們的天敵數量',
      option_3: '影響孵化溫度，導致性別失衡',
      answer: 3,
      explanation: '巢穴溫度升高會導致雌龜比例過高，影響族群繁衍。',
    },
    {
      question_id: 4,
      quiz_id: 1,
      question_description: '蘇眉魚族群難以從捕撈中恢復，主因是其何種特性？',
      option_1: '壽命短、繁殖快',
      option_2: '食物來源單一',
      option_3: '生長緩慢、性成熟晚',
      answer: 3,
      explanation: '蘇眉魚生長慢且性成熟晚，導致被捕後族群難以補充。',
    },
    {
      question_id: 6,
      quiz_id: 1,
      question_description: '綠蠵龜受塑膠垃圾威脅，主因常是？',
      option_1: '塑膠改變海水鹽度',
      option_2: '誤食塑膠袋或被漁網纏繞',
      option_3: '塑膠增加海底沉積物',
      answer: 2,
      explanation: '海龜常將塑膠誤認為食物吞食，或被廢棄漁具纏繞窒息。',
    },
    {
      question_id: 11,
      quiz_id: 2,
      question_description: '哪種污染物是海洋中最常見且持久的，對海洋生態造成廣泛威脅？',
      option_1: '有機廢物',
      option_2: '塑膠垃圾',
      option_3: '玻璃碎片',
      answer: 2,
      explanation: '塑膠因其極難分解的特性，是海洋中最主要的污染物。',
    },
    {
      question_id: 15,
      quiz_id: 2,
      question_description: '「幽靈漁具」對海洋環境的威脅是什麼？',
      option_1: '它們會發出噪音干擾海洋生物',
      option_2: '是廢棄或遺失的漁具，在海中持續捕殺生物',
      option_3: '它們會吸收海水中的氧氣',
      answer: 2,
      explanation: '被遺棄的漁網和漁線會持續在海中「捕魚」，造成大量海洋生物的意外死亡。',
    },
    {
      question_id: 21,
      quiz_id: 3,
      question_description: '什麼是造成全球漁業資源枯竭的首要原因？',
      option_1: '氣候變遷',
      option_2: '過度捕撈',
      option_3: '海洋污染',
      answer: 2,
      explanation: '過度捕撈是指捕魚速度快於魚類繁殖補充的速度，這是導致全球魚類資源枯竭的主因。',
    },
    {
      question_id: 31,
      quiz_id: 4,
      question_description: '哪項是海洋棲地破壞（如珊瑚礁、紅樹林、海草床）的最主要人為原因？',
      option_1: '自然地質變化',
      option_2: '沿海開發與填海造地',
      option_3: '深海採礦活動',
      answer: 2,
      explanation: '沿海地區的人口增長和基礎設施開發直接導致棲地被破壞或改變，是主要的人為因素。',
    },
    {
      question_id: 32,
      quiz_id: 4,
      question_description: '疏浚和沿海建設（如港口、碼頭）如何直接破壞海洋棲地？',
      option_1: '增加海水鹽度，不利生物生存',
      option_2: '物理性破壞海底結構和生物群落',
      option_3: '引入外來物種改變生態系統',
      answer: 2,
      explanation: '這些活動直接挖除或覆蓋海底地形，徹底毀滅了珊瑚、海草等固定的棲地。',
    },
    {
      question_id: 33,
      quiz_id: 4,
      question_description: '陸地上的森林砍伐和不當土地利用，如何間接導致海洋棲地破壞？',
      option_1: '減少海水溫度，影響海洋生物',
      option_2: '增加陸源沉積物和污染物徑流入海',
      option_3: '吸引更多海洋生物靠近海岸線',
      answer: 2,
      explanation:
        '森林砍伐導致土壤侵蝕，大量泥沙和污染物被沖入海洋，覆蓋或毒害沿海棲地，如珊瑚礁和海草床。',
    },
    {
      question_id: 34,
      quiz_id: 4,
      question_description: '珊瑚礁被稱為「海洋雨林」，最主要原因是什麼？',
      option_1: '它們提供大量淡水資源',
      option_2: '擁有極高的生物多樣性並保護海岸線',
      option_3: '它們能產生大量氧氣供全球使用',
      answer: 2,
      explanation:
        '珊瑚礁是全球海洋生物多樣性的熱點，為無數物種提供食物和庇護，同時也是海岸線的天然屏障。',
    },
  ])

  // 2. Getters: Use `computed()` for computed properties.
  //    This replaces the `getters: { ... }` option.
  //    It's useful for deriving new state from existing state.
  const totalQuizzes = computed(() => quizzes.value.length)
  const getQuizById = computed(() => (quizId) => {
    return quizzes.value.find((q) => q.id === quizId)
  })

  // 3. Actions: Actions are regular functions that modify the state.
  //    This replaces the `actions: { ... }` option.
  function addQuestionToQuiz(newQuestion) {
    const quiz = quizzes.value
    if (quiz) {
      // Find the next available ID for the new question
      const nextId = quiz.length > 0 ? Math.max(...quiz.map((q) => q.question_id)) + 1 : 1

      // Add the new question to the quiz's questions array
      quiz.push({ ...newQuestion, question_id: nextId })
    }
  }

  function deleteQuestionToQuiz(q_id) {
    const quiz = quizzes.value
    if (quiz) {
      const question_index = quiz.findIndex((q) => q.question_id == q_id)
      if (question_index != -1) quiz.splice(question_index, 1)
    }
  }

  function editQuestion(newQuestion) {
    const quiz = quizzes.value
    const question = quiz.find((q) => q.question_id == newQuestion.question_id)
    if (question) {
      Object.assign(question, newQuestion)
    }
  }

  // An example of an asynchronous action, simulating an API call.
  // This shows how to transition from dummy data to real data.
  async function fetchAllQuizzes() {
    // Simulate an API call with a delay
    console.log('Simulating API call to fetch quizzes...')
    const response = await new Promise((resolve) => {
      setTimeout(() => {
        // This is the data that a real API would return
        const newQuizzes = [
          {
            id: 3,
            title: 'Sass & CSS',
            questions: [{ id: 4, title: 'Sass is a CSS preprocessor.', type: 'tf' }],
          },
        ]
        resolve(newQuizzes)
      }, 1000)
    })

    // Replace the local state with the data from the simulated API
    quizzes.value = response
  }

  return {
    quizzes,
    totalQuizzes,
    getQuizById,
    addQuestionToQuiz,
    deleteQuestionToQuiz,
    editQuestion,
    fetchAllQuizzes,
  }
})
