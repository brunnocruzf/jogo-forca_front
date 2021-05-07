var entrada;
var respostaAtual;
var perguntaAtual;
var maxTentativas = 6;
var tentativas = maxTentativas;
var faseAtual;
var ganhou;
var perdeu;
var acertos;
var evento;

var aluno = new Array();
aluno[1]  = "";

//Esquipe: 3 9 11 13 21 24
var invalido = new Array();
invalido[0] = aluno[3];
invalido[1] = aluno[9];
invalido[2] = aluno[11];
invalido[3] = aluno[13];
invalido[4] = aluno[21];
invalido[5] = aluno[24];

var msg = new Array();
msg[0] = "Informe uma letra.";
msg[1] = "Parabéns, você acertou!";
msg[2] = "Errou! Preste mais atenção na próxima vez.";
msg[3] = "Este jogador não pode participar do jogo.";
msg[4] = "Ocorreu um erro, tente novamente.";
msg[5] = "Informe uma resposta.";
msg[6] = "Este jogador já foi sorteado!";
msg[7] = "Esta letra já foi informada!";
msg[8] = "Letra errada, tente outra.";

var pergunta = new Array();
pergunta[1] = "cor" ;

var resposta = new Array();
resposta[1] = "brunno";


var imagem = new Array();
imagem[0] = "img/forca0.png";
imagem[1] = "img/forca1.png";
imagem[2] = "img/forca2.png";
imagem[3] = "img/forca3.png";
imagem[4] = "img/forca4.png";
imagem[5] = "img/forca5.png";
imagem[6] = "img/forca6.png";

var letraInformada = new Array();
var letraErrada = new Array();
var todasLetras = new Array();
var historico = new Array();

$(document).ready(function inicio(){
	$("#forca").append("<img id='imgForca' src='" + imagem[0] + "' width='50%' />");
	ganhou = false;
	perdeu = false;
	faseAtual = 1;
	acertos = 0;
	$("#resposta").text(" ").hide();
	$("#respostaInformada").text(" ").hide();
	$("#perguntas").hide();
	$("#mensagem").hide();
	$("#bntNovoJogo").hide();
	$("#faseAtual").text("Fase " + faseAtual);
	$("#numTentativas").text("Tentativas: " + tentativas);

	montaPalavra();
	memento();
});

function trocaImagem(){
	var valor;
	switch(tentativas){
		case 0:
			$("#imgForca").attr("src", imagem[6]);
			break;
		case 1:
			$("#imgForca").attr("src", imagem[5]);
			break;
		case 2:
			$("#imgForca").attr("src", imagem[4]);
			break;
		case 3:
			$("#imgForca").attr("src", imagem[3]);
			break;
		case 4:
			$("#imgForca").attr("src", imagem[2]);
			break;
		case 5:
			$("#imgForca").attr("src", imagem[1]);
			break;
		case 6:{
			$("#imgForca").attr("src", imagem[0]);
			break;
		}
	}
}

$("#bntGeraJogador").click(function gerarJogador(){
	$("#faseAtual").text("Fase " + faseAtual);
	$("#numTentativas").text("Tentativas: " + tentativas);

	elementosHabilitados();

	$("#mensagem").text(" ");
	/*
	var jogadorEscolhido;
	jogadorEscolhido = Math.floor((Math.random() * aluno.length) + 1);

	localStorage.setItem("jogadorEscolhido", jogadorEscolhido);

	for(var i = 0; i < invalido.length; i++){

		if(invalido[i] == aluno[jogadorEscolhido]){
			elementosDesabilitados();
			if(i > 5){
				$("#mensagem").removeClass("sucesso");
				$("#mensagem").text(msg[6]).show().addClass("erro");
			}else{
				$("#mensagem").removeClass("sucesso");
				$("#mensagem").text(msg[3]).show().addClass("erro");
			}
		}else if(aluno[jogadorEscolhido] == "undefined"
			|| aluno[jogadorEscolhido] == null){
			$("#mensagem").removeClass("sucesso");
			$("#mensagem").text(msg[4]).show().addClass("erro");
		}else{

			$("#jogadorGerado").text(aluno[jogadorEscolhido]);
		}
	}
	invalido[++i] = aluno[jogadorEscolhido];*/

	$("#perguntas").show();

	entrada = null;
	$("#entradaLetra").val(null);
	$("#entradaResposta").val(null);
});

$("#entradaLetra").keyup(function informaLetra(){
	entrada = $("#entradaLetra").val().toUpperCase();
	$("#entradaResposta").val(null);

	localStorage.setItem("entradaLetra", entrada);

});


$("#bntTentar").click(function tentarLetra(){
	$("#mensagem").text(" ");
	var entradaLetra = $("#entradaLetra").val();
	if(entrada == null){
		$("#mensagem").removeClass("sucesso");
		$("#mensagem").text(msg[0]).show().addClass("erro");
	}else{
		if(entradaLetra == null || entradaLetra == "" || entradaLetra == "undefined"){
			//entrada = null;
			$("#mensagem").removeClass("sucesso");
			$("#mensagem").text(msg[0]).show().addClass("erro");
		}else{
			if(letraInformada.indexOf(entrada) < 0){
				letraInformada.push(entrada);
				todasLetras.push(entrada);
				$("#letraEscolhida").text("Letras informadas: " + todasLetras.join());

				localStorage.setItem("todasLetras", todasLetras.join());

				preencheLacuna();
			}else{
				$("#mensagem").removeClass("sucesso");
				$("#mensagem").text(msg[7]).show().addClass("erro");
			}
		}
	}
	//$("#entradaLetra").val(null);
	$("#entradaResposta").val(null);
	entrada = null;
});

$("#entradaResposta").keyup(function informaResposta(){
	entrada = $("#entradaResposta").val().toUpperCase();
	$("#entradaLetra").val(null);

	localStorage.setItem("entradaResposta", entrada);
});

$("#bntResponder").click(function responder(){
	var entradaResposta = $("#entradaResposta").val();;
	$("#mensagem").text(" ").show();

	if(entrada == null){
		$("#mensagem").removeClass("sucesso");
		$("#mensagem").text(msg[5]).show().addClass("erro");
	}else{
			if(entradaResposta == null || entradaResposta == "" || entradaResposta == "undefined"){
			//entrada = null;
			$("#mensagem").removeClass("sucesso");
			$("#mensagem").text(msg[5]).show().addClass("erro");
		}else{
			$("#respostaInformada").text("Resposta Informada: " + entrada).show();
			fase();
			if(perdeu){
				gameOver();
			}
		}
	}
	entrada = null;
	$("#entradaLetra").val(null);
});

function fase(){
	perguntaAtual = pergunta[faseAtual];
	respostaAtual = resposta[faseAtual].toUpperCase();

	localStorage.setItem("perguntaAtual", perguntaAtual);
	localStorage.setItem("respostaAtual", respostaAtual);

	$("#perguntaAtual").text(perguntaAtual);

	if(entrada == respostaAtual){
		ganhou = true;
		perdeu = false;
		preencheLacuna();
		vitoria();

	}else{
		perdeu = true;
		$("#mensagem").removeClass("sucesso");
		$("#mensagem").text(msg[2]).addClass("erro");
		$("#numTentativas").text("Tentativas: " + tentativas);
	}

}

function montaPalavra(){
	respostaAtual = resposta[faseAtual].toUpperCase();
	var qntLetras = respostaAtual.length;

	for(var i=0; i<qntLetras; i++){

		$("#palavra").append('<input id="l' + i + '" class="letra" type="text" disabled="disabled" size="1" />');
		if(respostaAtual.charAt(i) == "-"){
			$("#l"+i).val("-");
		}else if(respostaAtual.charAt(i) == " "){
			$("#l"+i).addClass("invisivel");
			$("#l"+i).val(null);
		}else{
			$("#l"+i).val(null);
		}
	}
	fase();
}

function preencheLacuna(){
	var qntLetras = respostaAtual.length;
	var letraInformada = respostaAtual.search(entrada);

	if(ganhou){
		for(var i=0; i<=qntLetras; i++){
			$("#l"+i).val(respostaAtual.charAt(i));
		}
	}else{
		var acertoLetra = 0;
		if(letraInformada > -1){
			acertos++;

			if(acertos >= qntLetras){
				vitoria();
			}

			for(var i=0; i<=qntLetras; i++){
				if(entrada == respostaAtual.charAt(i)){
					$("#l"+i).val(respostaAtual.charAt(letraInformada));
					acertoLetra++;
				}
			}
			acertos = acertos + acertoLetra -1;
			//$("#l"+letraInformada).val(respostaAtual.charAt(letraInformada));
		}else{
			letraErrada.push(entrada);
			$("#letraErrada").text("Letras Erradas: " + letraErrada.join());
			tentativas--;
			trocaImagem();
			$("#mensagem").removeClass("sucesso");
			$("#mensagem").text(msg[8]).show().addClass("erro");
			$("#numTentativas").text("Tentativas: " + tentativas);
			if(tentativas <= 0){
				gameOver();
			}
		}
	}
}

function elementosHabilitados(){
	$("#bntResponder").removeAttr("disabled", "disabled");
	$("#bntTentar").removeAttr("disabled", "disabled");
	$("#entradaResposta").removeAttr("disabled", "disabled");
	$("#entradaLetra").removeAttr("disabled", "disabled");
}

function elementosDesabilitados(){
	$("#numTentativas").text("Tentativas: " + tentativas);
	$("#bntResponder").attr("disabled", "disabled");
	$("#bntTentar").attr("disabled", "disabled");
	$("#entradaResposta").attr("disabled", "disabled");
	$("#entradaLetra").attr("disabled", "disabled");
}

function gameOver(){
	$("#imgForca").attr("src", imagem[6]);
	var qntLetras = respostaAtual.length;
	elementosDesabilitados();
	faseAtual++;

	localStorage.setItem("faseAtual", faseAtual);

	perguntaAtual = pergunta[faseAtual];
	perdeu = true;
	$("#mensagem").removeClass("sucesso");
	$("#mensagem").text(msg[2]).addClass("erro");
	$("#bntNovoJogo").show();
	$("#bntGeraJogador").attr("disabled", "disabled");
	//fim();
}

function vitoria(){
	$("#mensagem").removeClass("erro");
	$("#mensagem").text(msg[1]).addClass("sucesso").show();
	faseAtual++;

	localStorage.setItem("faseAtual", faseAtual);

	tentativas = maxTentativas;
	elementosDesabilitados();
	perguntaAtual = pergunta[faseAtual];
	$("#bntNovoJogo").show();
	$("#bntGeraJogador").attr("disabled", "disabled");
	//fim();
}

$("#bntNovoJogo").click(function zeraCampos(){
	window.location.reload();
});

function fim(){

}

function memento(){

	var passo = localStorage.getItem("passo");

	if(passo == null || passo == "undefined"
		|| passo == ""){
		evento = 0;
	}
	evento++;
	historico.push(evento);
	localStorage.setItem("passo", evento);
}