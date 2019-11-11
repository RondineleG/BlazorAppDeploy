function criarAlert()
{
   alert("Ola Mundo");
}
function criarPrompt(question)
{
    return prompt(question);
}

function pegarElemento(id, text)
{
    document.getElementById(id).innerText = text;
}


function focusCanpo (element)
{
    element.focus();

}