window.onload = function () {
  const raw = document.querySelector('#question');
  
  function refresh() {
    sessionStorage.removeItem('html');
    location.reload();
  }

  document.getElementById("reset").addEventListener("click", refresh, false);

  document.querySelectorAll(".next").forEach(button => {
    button.addEventListener("click", nextQuestion, false);
  });
  
  document.getElementById("first").addEventListener("change", readFile, false);

  let numberInput = document.querySelector('input[type=number]');
  numberInput.addEventListener ("keydown", onEnter);
  
  function onEnter (e) {
    if (e.key === 'Enter') {
      let number = document.querySelector('input[type=number]').value;
      pickQuestion(number);
    }
  }

  function nextQuestion() {
    pickQuestion();
    // location.reload();
  }
  
  function generateRandomNum(questions) {
    return Math.ceil(Math.random() * questions.length);
  }
  
  
  if (sessionStorage.length > 0) {
    document.querySelector('.file-picker').classList.add('hidden');
  
    pickQuestion();
  }
    
  function readFile() {
    const file = document.querySelector('input[type=file]').files[0]
    const reader = new FileReader();
  
    reader.addEventListener("load", () => {
      const html = marked.parse(reader.result);
      sessionStorage.setItem('html', html);
      raw.innerHTML = '<p>Click <strong>"Next Random Question"</strong> to continue</p>';
    }, false);
  
    if (file) {
      reader.readAsText(file);
    }
  }
    
  function pickQuestion(randomNum = 0) {
    const session = sessionStorage.getItem('html');
    const questions = session.match(/<h1 id=".*">(.*)<\/h1>/g);

    randomNum = Number(randomNum) || generateRandomNum(questions);

    let regEx = '';
  
    if (randomNum + 1 > questions.length) {
      regEx = new RegExp(`(<h1.*Question ${randomNum}.*(\n.*){1,}\n*)`)
    } else {
      regEx = new RegExp(`(<h1.*Question ${randomNum}.*(\n.*){1,})<h1.*Question ${randomNum + 1} `);
    }

    console.log(regEx);
  
    const sessionMatch = session.match(regEx)[1];
    const answerRegEx = new RegExp(`(<h2 id=".*">Answer<\/h2>)(.*(\n.*){1,})`);
    const addDetails = '<details><br><summary>Answer</summary>$2<br></details>';
    raw.innerHTML = sessionMatch.replace(answerRegEx, addDetails);
    hljs.highlightAll();
  }
}