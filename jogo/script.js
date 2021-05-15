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
aluno[1] = "";

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
msg[2] = "GAME OVER, Palavra errada.";
msg[3] = "Este jogador não pode participar do jogo.";
msg[4] = "Ocorreu um erro, tente novamente.";
msg[5] = "Digite uma resposta.";
msg[6] = "Este jogador já foi sorteado!";
msg[7] = "Esta letra já foi informada!";
msg[8] = "Letra errada, tente outra.";

var pergunta = new Array();
pergunta[1] = localStorage.getItem("categoria");
pergunta[2] = localStorage.getItem("categoria");
pergunta[3] = localStorage.getItem("categoria");
pergunta[4] = localStorage.getItem("categoria");
pergunta[5] = localStorage.getItem("categoria");
pergunta[6] = localStorage.getItem("categoria");
pergunta[7] = localStorage.getItem("categoria");
pergunta[8] = localStorage.getItem("categoria");
pergunta[9] = localStorage.getItem("categoria");
pergunta[10] = localStorage.getItem("categoria");

var resposta = new Array();

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

$(document).ready(function inicio() {
	$("#imgForca").hide();
	$("#rotulo").hide();
	$("#forca").append("<img hidden id='imgForca' src='" + imagem[0] + "' width='50%' />");
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

	memento();

	localStorage.setItem("pontuacao", 0);



	//CARREGA RANKING

	$.ajax({
		url: 'https://jogo-forca.herokuapp.com/ranking/',
		type: "get",
		scriptCharset: 'UTF-8',
		crossDomain: true,
		dataType: 'JSON',
		success: function (data) {
			for (var i = 0; i < 10; i++) {
				$('#tbody').append('<tr>' +
					'<td><span>' + (parseInt(i) + 1) + '</span></td>' +
					'<td><span>' + data[i].nomeJogador + '</span></td>' +
					'<td><span>' + data[i].pontuacao + '</span></td>' +
					'</tr>');
			}
		}
	})

	//carrega categorias

	$.ajax({
		url: 'https://jogo-forca.herokuapp.com/categorias',
		type: "get",
		scriptCharset: 'UTF-8',
		crossDomain: true,
		dataType: 'json',
		success: function (data) {
			//var myJSON = JSON.stringify(data);
			//altarr para preencher select

			data['categorias'].forEach(function (fn, scope) {
				$('#select').append('<option dado="'+ fn['id'] +'" value="' + fn['descricao'] + '">' + fn['descricao'] + '</option>');
			});
		},
	})


});

function trocaImagem() {
	var valor;
	switch (tentativas) {
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
		case 6: {
			$("#imgForca").attr("src", imagem[0]);
			break;
		}
	}
}

$("#bntGeraJogador").click(function gerarJogador() {
	$("#bntGeraJogador").remove();
	$("#faseAtual").text("Fase " + faseAtual);
	$("#numTentativas").text("Tentativas: " + tentativas);

	$('#imgForca').show();

	elementosHabilitados();

	$("#mensagem").text(" ");

	$("#perguntas").show();
	$("#rotulo").show();

	$("#exibeRanking").hide();
	$("#select").hide();

	entrada = null;
	$("#entradaLetra").val(null);

	//busca palavra
	var categoria = $('#select').val();
	if(categoria == '000') {
		$.ajax({
			url: 'https://jogo-forca.herokuapp.com/palavras',
			type: "get",
			scriptCharset: 'UTF-8',
			crossDomain: true,
			dataType: 'json',
			success: function (data) {
				var resposta = new Array();
				localStorage.setItem("resposta", data['palavra']);
				localStorage.setItem("categoria", "Não informada.");
				console.log(data['palavra']);
				montaPalavra();
			},
		})
	}else {
		$.ajax({
			url: 'https://jogo-forca.herokuapp.com/palavras/'+categoria,
			type: "get",
			scriptCharset: 'UTF-8',
			crossDomain: true,
			dataType: 'json',
			success: function (data) {
				var resposta = new Array();
				localStorage.setItem("resposta", data['palavra']);

				localStorage.setItem("categoria",categoria);
				console.log(data);
				montaPalavra();
			},
		})
	}

	resposta[1] = localStorage.getItem("resposta");

});

$("#bntNovoJogo").click(function gerarJogador() {
	$("#bntGeraJogador").remove();
	$("#faseAtual").text("Fase " + faseAtual);
	$("#numTentativas").text("Tentativas: " + tentativas);

	$('#imgForca').show();

	elementosHabilitados();

	$("#mensagem").text(" ");

	$("#perguntas").show();

	entrada = null;
	$("#entradaLetra").val(null);

	document.location.reload(true);
});

$("#entradaLetra").keyup(function informaLetra() {

	entrada = $("#entradaLetra").val().toUpperCase();
	localStorage.setItem("entradaLetra", entrada);

});


$("#bntTentar").click(function tentarLetra() {
	$("#mensagem").text(" ");
	var entradaLetra = $("#entradaLetra").val();
	if (entrada == null) {
		$("#mensagem").removeClass("sucesso");
		$("#mensagem").text(msg[0]).show().addClass("erro");
	} else {
		if (entradaLetra == null || entradaLetra == "" || entradaLetra == "undefined") {

			$("#mensagem").removeClass("sucesso");
			$("#mensagem").text(msg[0]).show().addClass("erro");
		} else {
			if (letraInformada.indexOf(entrada) < 0) {
				letraInformada.push(entrada);
				todasLetras.push(entrada);
				$("#letraEscolhida").text("Letras informadas: " + todasLetras.join());

				localStorage.setItem("todasLetras", todasLetras.join());


				preencheLacuna();
				$("#entradaLetra").val('');

			} else {
				$("#mensagem").removeClass("sucesso");
				$("#mensagem").text(msg[7]).show().addClass("erro");
			}
		}
	}

	entrada = null;

});

function fase() {
	perguntaAtual = localStorage.getItem("categoria");
	respostaAtual = localStorage.getItem("resposta").toUpperCase();

	localStorage.setItem("perguntaAtual", perguntaAtual);
	localStorage.setItem("respostaAtual", respostaAtual);

	$("#perguntaAtual").text(perguntaAtual);

	if (entrada == respostaAtual) {
		ganhou = true;
		perdeu = false;
		preencheLacuna();
		vitoria();

	} else {
		perdeu = true;
		$("#mensagem").removeClass("sucesso");
		$("#mensagem").text(msg[2]).addClass("erro");
		$("#numTentativas").text("Tentativas: " + tentativas);
	}

}

function montaPalavra() {

	respostaAtual = localStorage.getItem("resposta");
	var qntLetras = respostaAtual.length;

	for (var i = 0; i < qntLetras; i++) {

		$("#palavra").append('<input id="l' + i + '" class="letra" type="text" disabled="disabled" size="1" />');
		if (respostaAtual.charAt(i) == "-") {
			$("#l" + i).val("-");
		} else if (respostaAtual.charAt(i) == " ") {
			$("#l" + i).addClass("invisivel");
			$("#l" + i).val(null);
		} else {
			$("#l" + i).val(null);
		}
	}
	fase();
}

function preencheLacuna() {
	var qntLetras = respostaAtual.length;
	var letraInformada = respostaAtual.search(entrada);

	if (ganhou) {
		for (var i = 0; i <= qntLetras; i++) {
			$("#l" + i).val(respostaAtual.charAt(i));
		}
	} else {
		var acertoLetra = 0;
		if (letraInformada > -1) {
			acertos++;

			if (acertos >= qntLetras) {
				vitoria();
			}

			for (var i = 0; i <= qntLetras; i++) {
				if (entrada == respostaAtual.charAt(i)) {
					$("#l" + i).val(respostaAtual.charAt(letraInformada));
					acertoLetra++;
				}
			}
			acertos = acertos + acertoLetra - 1;
			var pontuacao = localStorage.getItem("pontuacao");

			pontuacao = (parseInt(pontuacao) + parseInt(5));


			localStorage.setItem("pontuacao", pontuacao);

			$('#pontuacao > p').remove();

			$('#pontuacao').append('<p>Sua Pontuação: ' + localStorage.getItem("pontuacao") + '</p>')

		} else {
			letraErrada.push(entrada);
			$("#letraErrada").text("Letras Erradas: " + letraErrada.join());
			tentativas--;
			trocaImagem();
			$("#mensagem").removeClass("sucesso");
			$("#mensagem").text(msg[8]).show().addClass("erro");
			$("#numTentativas").text("Tentativas: " + tentativas);
			if (tentativas <= 0) {
				gameOver();
			}
		}
		if(pontuacao >= 6){
			bntCompra.disabled = false;
			
		}
	}
}

function diferencial(){
	var pontuacao = localStorage.getItem("pontuacao");

	

	$("#mensagem").text(msg[9]).show().addClass("erro");

	pontuacao = (parseInt(pontuacao) - parseInt(5));
	localStorage.setItem("pontuacao", pontuacao);

	$('#pontuacao > p').remove();

	$('#pontuacao').append('<p>Sua Pontuação: ' + localStorage.getItem("pontuacao") + '</p>')
	if(pontuacao <= 5){
		bntCompra.disabled = true;
	}
}

function elementosHabilitados() {
	$("#bntResponder").removeAttr("disabled", "disabled");
	$("#bntTentar").removeAttr("disabled", "disabled");
	$("#entradaLetra").removeAttr("disabled", "disabled");
}

function elementosDesabilitados() {
	$("#numTentativas").text("Tentativas: " + tentativas);
	$("#bntResponder").attr("disabled", "disabled");
	$("#bntTentar").attr("disabled", "disabled");
	$("#entradaLetra").attr("disabled", "disabled");
}

function gameOver() {
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

	$("#resposta").css({display: 'inline'});
	$('#resposta').append("<p>Resposta correta: " + localStorage.getItem("resposta") + "</p>")


	var pontuacao = localStorage.getItem("pontuacao");
	localStorage.setItem("pontuacao", pontuacao);
	$('#info').append("<b style='color: red'>VOCE PERDEU! - PONTUAÇÃO: " + pontuacao + "</b>");

	$.ajax({
		url: 'https://jogo-forca.herokuapp.com/ranking/',
		type: "get",
		scriptCharset: 'UTF-8',
		crossDomain: true,
		dataType: 'JSON',
		success: function (data) {

			console.log(data[0].idRanking);

			var flag = false;
			var pontos = 0;
			for (var i = 0; i < 10; i++) {

				if (data[i].pontuacao > pontos) {
					pontos = data[i].pontuacao;
				}
			}

			if (pontuacao > pontos) {
				$('#incRanking').append('<table><tr><td><input type="text" style="font-size: 14px!important;" class="form-control" id="nomeRanking"></td><td><span style="width: 20px !important; height: 10px !important; font-size: 26px;" onclick="salvaRanking(' + pontuacao + ')" class="bnt btn-success">Salvar</span></td></tr></table>');
				for (var i = 0; i < 10; i++) {
					$('#tbody').append('<tr>' +
						'<td><span>' + (parseInt(i) + 1) + '</span></td>' +
						'<td><span>' + data[i].nomeJogador + '</span></td>' +
						'<td><span>' + data[i].pontuacao + '</span></td>' +
						'</tr>');
				}
			} else {
				for (var i = 0; i < 10; i++) {
					$('#tbody').append('<tr>' +
						'<td><span>' + (parseInt(i) + 1) + '</span></td>' +
						'<td><span>' + data[i].nomeJogador + '</span></td>' +
						'<td><span>' + data[i].pontuacao + '</span></td>' +
						'</tr>');
				}
			}

			$('#ranking').show();
			console.log(pontuacao);
			console.log(pontos);
		},
	})
	//fim();
}

function fechamodal() {
	$('#ranking').hide();
}

function vitoria() {
	$("#mensagem").removeClass("erro");
	$("#mensagem").text(msg[1]).addClass("sucesso").show();
	faseAtual++;

	localStorage.setItem("faseAtual", faseAtual);

	tentativas = maxTentativas;
	elementosDesabilitados();
	perguntaAtual = pergunta[faseAtual];
	$("#bntNovoJogo").show();
	$("#bntGeraJogador").attr("disabled", "disabled");

	var pontuacao = localStorage.getItem("pontuacao");
	pontuacao = (parseInt(pontuacao) + parseInt(100));
	localStorage.setItem("pontuacao", pontuacao);
	$('#info').append("<b style='color: forestgreen'>PARABENS VOCE VENCEU! - PONTUAÇÃO: " + pontuacao + "</b>");

	$.ajax({
		url: 'https://jogo-forca.herokuapp.com/ranking/',
		type: "get",
		scriptCharset: 'UTF-8',
		crossDomain: true,
		dataType: 'JSON',
		success: function (data) {

			console.log(data[0].idRanking);

			var pontos = 0;
			var flag = false;
			for (var i = 0; i < 10; i++) {
				if (data[i].pontuacao < pontos) {
					pontos = data[i].pontuacao;
				}
			}
			if (pontuacao > pontos) {
				$('#incRanking').append('<table><tr><td><input type="text" style="font-size: 14px!important;" class="form-control" id="nomeRanking"></td><td><span style="width: 20px !important; height: 10px !important; font-size: 26px;" onclick="salvaRanking(' + pontuacao + ')" class="bnt btn-success">Salvar</span></td></tr></table>');
				for (var i = 0; i < 10; i++) {
					$('#tbody').append('<tr>' +
						'<td><span>' + (parseInt(i) + 1) + '</span></td>' +
						'<td><span>' + data[i].nomeJogador + '</span></td>' +
						'<td><span>' + data[i].pontuacao + '</span></td>' +
						'</tr>');
				}
			} else {
				for (var i = 0; i < 10; i++) {
					$('#tbody').append('<tr>' +
						'<td><span>' + (parseInt(i) + 1) + '</span></td>' +
						'<td><span>' + data[i].nomeJogador + '</span></td>' +
						'<td><span>' + data[i].pontuacao + '</span></td>' +
						'</tr>');
				}
			}


			console.log(pontuacao);
		},
	})

	$('#ranking').show();

	$('#pontuacao > p').remove();

	$('#pontuacao').append("<p>Sua pontuação: " + localStorage.getItem("pontuacao") + "</p>");

	//fim();
}

function salvaRanking(pontuacao) {
	var nome = $('#nomeRanking').val();
	$.ajax({
		url: 'https://jogo-forca.herokuapp.com/ranking/' + nome + '/' + pontuacao,
		type: "post",
		scriptCharset: 'UTF-8',
		crossDomain: true,
		dataType: 'json',
		success: function (data) {
			alert("Nome inserido com sucesso!")
			$('#nomeRanking').val('');
			window.open('https://brunnocruzf.github.io/jogo-forca_front/ranking/');
			fechamodal();
		},
	})
}

function fim() {

}

function memento() {

	var passo = localStorage.getItem("passo");

	if (passo == null || passo == "undefined"
		|| passo == "") {
		evento = 0;
	}
	evento++;
	historico.push(evento);
	localStorage.setItem("passo", evento);
}