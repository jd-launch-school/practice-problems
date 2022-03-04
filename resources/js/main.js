window.onload = function () {
  init();
};

function init () {
  const raw = document.querySelector('#question');
  
  function refresh() {
    sessionStorage.removeItem('html');
    location.reload();
  }

  document.querySelector("#reset").addEventListener("click", refresh, false);
  document.querySelector(".random").addEventListener("click", pickQuestion, false);
  document.querySelector("#first").addEventListener("change", readFile, false);
  document.querySelector("#previous").addEventListener("click", previous, false);
  document.querySelector("#next").addEventListener("click", next, false); 

  let numberInput = document.querySelector('input[type=number]');
  numberInput.addEventListener ("keydown", onEnter);

  
  function onEnter (e) {
    if (e.key === 'Enter') {
      let number = numberInput.value;
      pickQuestion(number);
    }
  }

  function previous () {
    const session = sessionStorage.getItem('html');
    const questions = session.match(/<h1 id=".*">(.*)<\/h1>/g);

    let previousQuestionNum = Number(document.querySelector('div#question h1')
      .textContent.match(/Question (\d+)/)[1]) - 1;

    previousQuestionNum = previousQuestionNum >= 1 ? previousQuestionNum : questions.length;

    pickQuestion(previousQuestionNum);
    numberInput.value = previousQuestionNum;
  };

  function next () {
    const session = sessionStorage.getItem('html');
    const questions = session.match(/<h1 id=".*">(.*)<\/h1>/g);

    let nextQuestionNum = Number(document.querySelector('div#question h1')
      .textContent.match(/Question (\d+)/)[1]) + 1;
    
    nextQuestionNum = nextQuestionNum < questions.length ? nextQuestionNum : 1;

    pickQuestion(nextQuestionNum);
    numberInput.value = nextQuestionNum;
  };
  
  function generateRandomNum(questions) {
    return Math.ceil(Math.random() * questions.length);
  }
  
  
  if (sessionStorage.length > 0) {
    document.querySelector('p#file-picker').classList.add('hidden');
    pickQuestion();
  }
    
  function readFile() {
    const file = document.querySelector('input[type=file]').files[0]
    const reader = new FileReader();
  
    reader.addEventListener("load", () => {
      const html = marked.parse(reader.result);
      sessionStorage.setItem('html', html);
      raw.innerHTML = '<p>Click <strong>"Random Question"</strong> to continue</p>';
    }, false);
      document.querySelector('p#file-picker').classList.add('hidden');
  
    if (file) {
      reader.readAsText(file);
    }
  }
    
  function pickQuestion(num = 0) {
    const session = sessionStorage.getItem('html');
    const questions = session.match(/<h1 id=".*">(.*)<\/h1>/g);

    num = Number(num) || generateRandomNum(questions);

    let regEx = '';
  
    if (num + 1 > questions.length) {
      regEx = new RegExp(`(<h1.*Question ${num}.*(\n.*){1,}\n*)`)
    } else {
      regEx = new RegExp(`(<h1.*Question ${num}.*(\n.*){1,})<h1.*Question ${num + 1} `);
    }
  
    const sessionMatch = session.match(regEx)[1];
    const answerRegEx = new RegExp(`(<h2 id=".*">Answer<\/h2>)(.*(\n.*){1,})`);
    const addDetails = '<details><br><summary>Answer</summary>$2<br></details>';
    raw.innerHTML = sessionMatch.replace(answerRegEx, addDetails);
    hljs.highlightAll();
    hljs.initLineNumbersOnLoad();
    numberInput.value = num;

    document.getElementById("theme").addEventListener("click", toggleTheme, false);
  }
}

function toggleTheme () {
  const body = document.body;

  if (body.hasAttribute('class', 'dark-mode')) {
    body.removeAttribute('class', 'dark-mode');
  } else {
    body.setAttribute('class', 'dark-mode');
  }
}
