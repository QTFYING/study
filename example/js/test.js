var buttons = document.querySelectorAll('.button');
var outputs = document.querySelector('#output');
for(var i = 0;i < buttons.length; i++ ) {
    buttons[i].addEventListener('click', function() {
      console.log(i);
      outputs.innerText = buttons[i].innerHTML;
    }, false);
}