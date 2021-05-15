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
var visivel = [];
var c = 0;

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
msg[9] = "Compra de letra efetuada com sucesso.";

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

$("#bntNovoJogo").click(function zeraCampos() {

	var pontuacao = localStorage.getItem("pontuacao");
	if(pontuacao >= 200){
		bntCompra.disabled = false;
		window.document.getElementById("bntCompra").style.background = "#8CAEEC";
	}

	$("#faseAtual").text("Fase " + faseAtual);
	$("#numTentativas").text("Tentativas: " + tentativas);
	$("#resposta").text("A resposta correta é: " + respostaAtual).show();
	$("#perguntaAtual").text("Questão: " + perguntaAtual);

	var qntLetras = respostaAtual.length;
	for(var i=0; i<=qntLetras; i++){
		$("#l"+i).remove();
	}
	$("#bntGeraJogador").removeAttr("disabled", "disabled");
	$("#respostaInformada").text(" ");
	$("#letraErrada").text(" ");
	$("#letraEscolhida").text(" ");
	$("#jogadorGerado").text(" ");
	$("#resposta").text(" ").hide();
	$("#respostaInformada").text(" ").hide();
	$("#entradaResposta").val(null);
	$("#entradaLetra").val(null);
	$("#perguntas").show();
	$("#mensagem").hide();

	$("#bntNovoJogo").hide();

	acertos = 0;
	//entrada = null;
	tentativas = maxTentativas;
	ganhou = false;
	perdeu = false;
	letraInformada = new Array();
	letraErrada = new Array();
	todasLetras = new Array();

	$("#bntNovoJogo").hide();

	$("#imgForca").attr("src", imagem[0]);
	elementosHabilitados();

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

			for (var i = 0; i <= qntLetras; i++) {
				if (entrada == respostaAtual.charAt(i)) {
					$("#l" + i).val(respostaAtual.charAt(letraInformada));
					acertoLetra++;
					visivel[c] = respostaAtual.charAt(i);
					c++;
				}
			}
			acertos = acertos + acertoLetra - 1;
			var pontuacao = localStorage.getItem("pontuacao");

			pontuacao = (parseInt(pontuacao) + parseInt(5));

			localStorage.setItem("pontuacao", pontuacao);

			$('#pontuacao > p').remove();

			$('#pontuacao').append('<p>Sua Pontuação: ' + localStorage.getItem("pontuacao") + '</p>')
		
			//habilita botao diferencial
			if(pontuacao >= 200){
				bntCompra.disabled = false;
				window.document.getElementById("bntCompra").style.background = "#8CAEEC";
			}

			if (acertos >= qntLetras) {
				vitoria();
			}
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
	}
}

function diferencial(){

	$("#mensagem").removeClass("erro");
	$("#mensagem").text(msg[9]).show().addClass("sucesso");

	window.document.getElementById("bntCompra").style.background = "#B3BFD4";
	
	var pontuacao = localStorage.getItem("pontuacao");
	var tam = 1;

	$("#mensagem").text(msg[9]).show().addClass("erro");
	//desconta 200 pontos caso use diferencial
	pontuacao = (parseInt(pontuacao) - parseInt(200));
	localStorage.setItem("pontuacao", pontuacao);

	$('#pontuacao > p').remove();

	$('#pontuacao').append('<p>Sua Pontuação: ' + localStorage.getItem("pontuacao") + '</p>')
	if(pontuacao <= 199){
		bntCompra.disabled = true;
	}
	letrasorteada();
}

function letrasorteada() {
	var qntLetras = respostaAtual.length;
	var result           = '';
	var characters       = localStorage.getItem("resposta");
	var charactersLength = characters.length;
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
	
	

	var string = result.toUpperCase();
	console.log("string: " + string);

	if (ganhou) {
		for (var i = 0; i <= qntLetras; i++) {
			$("#l" + i).val(respostaAtual.charAt(i));
		}
	}else{
	
		var acertoLetra = 0;
		var teste = '';
		
		if (result != null) {
			acertos++;

			for(var j =0; j < c; j ++){
				
				if(string == visivel[j]){
					console.log("erro");
					var result2 = '';
					result2 += characters.charAt(Math.floor(Math.random() * charactersLength));
					string = result2.toUpperCase();
					console.log("string mudada: " + string);
				}
				if(string != visivel[j]){
					for (var i = 0; i <= qntLetras; i++) {
						if (string == respostaAtual.charAt(i)) {
							$("#l" + i).val(respostaAtual.charAt(i));
							
							visivel[c] = respostaAtual.charAt(i);	
						}
					}
				}
			}
			acertoLetra++;
			c++;
			console.log("visivel: " + visivel);
			console.log("valor de c: " + c);

			acertos = acertos + acertoLetra - 1;

			if (letraInformada.indexOf(string) < 0) {
				letraInformada.push(string);
				todasLetras.push(string);
				$("#letraEscolhida").text("Letras informadas: " + todasLetras.join());

				localStorage.setItem("todasLetras", todasLetras.join());
				$("#entradaLetra").val('');

			} else {
				$("#mensagem").removeClass("sucesso");
				$("#mensagem").text(msg[7]).show().addClass("erro");
			}


			if (acertos >= qntLetras) {
				vitoria();
			}
			}	else {
			
			if (tentativas <= 0) {
				gameOver();
			}
		}
	}
}

var letraa;

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

	bntCompra.disabled = true;
	window.document.getElementById("bntCompra").style.background = "#B3BFD4";
	visivel = [];
	c=0;
	console.log(pontuacao);


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