const questions = [
    {
        question: "What does the acronym HTML stand for?",
        answers: [
            "Home Tool Marking Language",
            "Hypertext Markup Language",
            "Hyperlinks and Text Mark Language",
            "Heavy Tool Making Language"
        ],
        correct: 2
    },
    {
        question: "What does the acronym CSS stand for?",
        answers: [
            "Colourful Style Sheets",
            "Computer Style Sheets",
            "Computer Science Sheets",
            "Cascading Style Sheets"
        ],
        correct: 4
    },
    {
        question: "What is the correct HTML tag to use when inserting javascript?",
        answers: [
            "<script>",
            "<head>",
            "<meta>",
            "<style>"
        ],
        correct: 1
    },
    {
        question: "What does the acronym CPU stand for?",
        answers: [
            "Central Progress Unit",
            "Central Process Unit",
            "Central Programming Unit",
            "Central Processing Unit"
        ],
        correct: 4
    },
    {
        question: 'What are the missing attributes?\n<img ?="icon.png" ?="Icon image" height=50 ?=50>',
        answers: [
            "src, href, alt",
            "title, alt, href",
            "src, alt, width",
            "type, value, width"
        ],
        correct: 3
    },
]


const answerIds = ["answer1", "answer2", "answer3", "answer4"]
let answerStyles = []

function getVar(name) {
    return JSON.parse(sessionStorage.getItem(String(name)))
}

function setVar(name, value) {
    sessionStorage.setItem(String(name), JSON.stringify(value))
    return value
}

function defaultVar(name, value) {
    if (getVar(name)) return;
    sessionStorage.setItem(String(name), JSON.stringify(value))
}

function incVar(name, amount = 1) {
    let value = getVar(name)
    return setVar(name, value + amount)
}

defaultVar("hasFinished", false)
defaultVar("currentQuestion", 0)
defaultVar("currentScore", 0)
defaultVar("currentAnswer", 0)

if (!JSON.parse(localStorage.getItem("highscore"))) {
    localStorage.setItem("highscore", JSON.stringify(0))
}

function displayQuestion() {
    setVar("hasFinished", false)

    let validation = document.getElementById("validation")
    validation.innerText = ""

    let next = document.getElementById("next")
    next.style.display = "none"

    let element = document.getElementById("questionnum")
    element.innerText = `Question ${getVar("currentQuestion") + 1}`

    let data = questions[getVar("currentQuestion")]
    element = document.getElementById("question")
    element.innerText = data.question

    answerIds.forEach((id, index) => {
        let element = document.getElementById(id)
        if (!answerStyles[index]) {
            answerStyles[index] = element.style
        }
        element.style = answerStyles[index]
        element.value = data.answers[index]
    })

    let num = getVar("currentAnswer")
    if (num != 0) answer(num)
}

function answer(num) {
    if (getVar("currentAnswer") != 0 && num != getVar("currentAnswer")) return;
    setVar("currentAnswer", num)

    let data = questions[getVar("currentQuestion")]

    answerIds.forEach((id, index) => {
        let element = document.getElementById(id)
        element.style = answerStyles[index]
    })

    let element = document.getElementById(`answer${num}`)
    element.style.backgroundColor = "rgb(61, 162, 245)"
    element.style.borderWidth = "0"
    element.style.color = "white"

    let validation = document.getElementById("validation")

    if (data.correct == num) {
        validation.style.color = "rgb(24, 207, 24)"
        validation.innerText = "Correct!"
    } else {
        validation.style.color = "rgb(207, 45, 24)"
        validation.innerText = "Incorrect!"

        let element = document.getElementById(`answer${data.correct}`)
        element.style.backgroundColor = "rgb(24, 207, 24)"
        element.style.borderWidth = "0"
        element.style.color = "white"
    }

    let next = document.getElementById("next")
    next.style.display = "block"
}

function nextQuestion() {
    let num = getVar("currentAnswer")
    if (num != 0) {
        let data = questions[getVar("currentQuestion")]

        if (data.correct == num) incVar("currentScore")
        incVar("currentQuestion")
        setVar("currentAnswer", 0)

        if (getVar("currentQuestion") >= questions.length) {
            setVar("currentQuestion", 0)
            setVar("hasFinished", true)

            location.replace("score.html")
        } else {
            displayQuestion()
        }
    }
}

function scores() {
    let score = getVar("currentScore")
    let highscore = JSON.parse(localStorage.getItem("highscore"))

    if (getVar("hasFinished")) {
        if (score > highscore) {
            if (highscore != 0) {
                let element = document.getElementById("congrats")
                element.style.display = "block"
            }

            highscore = score
            localStorage.setItem("highscore", JSON.stringify(highscore))
        }
    } else {
        let element = document.getElementById("retry")
        element.value = "Start"
    }

    let element = document.getElementById("score")
    element.innerText = `Your final score: ${score}`
    element = document.getElementById("highscore")
    element.innerText = `Your highscore: ${highscore}`

    if (highscore == questions.length) {
        let element = document.getElementById("retry")
        element.style.display = "none"
    }

    setVar("hasFinished", false)
}

function reset() {
    setVar("currentQuestion", 0)
    setVar("currentScore", 0)
    localStorage.setItem("highscore", JSON.stringify(0))

    location.replace("index.html")
}

function start(reset) {
    if (reset) {
        setVar("currentQuestion", 0)
        setVar("currentScore", 0)
    }

    location.replace("questions.html")
}

function init(p) {
    if (p == "start") {
        let element = document.getElementById("start")
        element.style.display = "block"

        if (getVar("currentQuestion") > 0) {
            element = document.getElementById("continue")
            element.style.display = "block"
        }
    } else if (p == "questions") {
        displayQuestion()
    } else if (p == "score") {
        let element = document.getElementById("retry")
        element.style.display = "block"
        element = document.getElementById("reset")
        element.style.display = "block"

        scores()
    }
}