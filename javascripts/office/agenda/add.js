$(document).ready(function(){

    //autocomplete
    $('#cliente').typeahead({
        source: function(query,process){

            clients = [];
            map = {};

            $.ajax({
                url: "/controller/office/cliente/search",            
                dataType: 'json',
                type: "POST",
                data: JSON.stringify({
                        query: query
                    }
                ),
                beforeSend: function(data){
                    $('.autocomplete .loading').removeClass('hidden');
                },
                success: function(data){
                    $('.autocomplete .loading').addClass('hidden');
                    $.each(data, function (i, client) {
                        map[client.nome] = client;
                        clients.push(client.nome);
                    });
                    //process
                    process(clients);
                },
                error: function(data){
                    $('.autocomplete .loading').addClass('hidden');
                }
            });
        },
        updater: function(item){
            var data = map[item].id;
            params.cliente = data;
            $('a#novo-cliente').addClass('hidden');
            $('a#alterar-cliente').removeClass('hidden');
            $('input#cliente').prop("disabled",true);
            return item;
        },
        matcher: function (item) {
            if (item.toLowerCase().indexOf(this.query.trim().toLowerCase()) != -1) {
                return true;
            }
        },
        minLength: 3,
        items: 5
    });

    // function checkSuccess(){
    //     //success
    //     if(getSession('success')){
    //         $('#success').removeClass('hidden');
    //         $('#success').find('p').html(getSession('success'));
    //     }
    //     setTimeout(function() {
    //         $('#success').addClass('hidden');
    //         destroySession('success');
    //     }, 5000);
    // }

    //validate
    $('form#formAdd').validate({
        onfocusout: false,
        onkeyup: false,
        rules: {
            nome: {
                required: true,
                minlength: 5
            },
            sexo: { 
                required: true
            },
            pais: { 
                required: true
            },
            estado: { 
                required: true
            },
            cidade: { 
                required: true
            }
        },
        messages: {
            nome: { 
                required: 'Preencha o nome de usuário',
                minlength: 'Vamos lá o nome de usuário deve ter cinco caracteres'
            },
            sexo: { 
                required: 'Qual o seu sexo?'
            },
            pais: { 
                required: 'Qual seu pais de origem?'
            },
            estado: { 
                required: 'Qual estado você reside?'
            },
            cidade: { 
                required: 'Falta pouco, qual cidade você reside?'
            }
        },
        highlight: function (element, errorClass, validClass) {
            if (element.type === "radio") {
                this.findByName(element.name).addClass(errorClass).removeClass(validClass);
                $(element).closest('.form-group').removeClass('has-success has-feedback').addClass('has-error has-feedback');
            } else {
                $(element).closest('.form-group').removeClass('has-success has-feedback').addClass('has-error has-feedback');
                $(element).closest('.form-group').find('i.fa').remove();
                $(element).closest('.form-group').append('<i class="fa fa-times fa-validate form-control-feedback fa-absolute"></i>');
            }
        },
        unhighlight: function (element, errorClass, validClass) {
            if (element.type === "radio") {
                this.findByName(element.name).removeClass(errorClass).addClass(validClass);
            } else {
                $(element).closest('.form-group').removeClass('has-error has-feedback').addClass('has-success has-feedback');
                $(element).closest('.form-group').find('i.fa').remove();
                $(element).closest('.form-group').append('<i class="fa fa-check fa-validate form-control-feedback fa-absolute"></i>');
            }
        },
        errorElement: 'span',
        errorClass: 'help-block',
        errorPlacement: function(error, element) {
            if(element.parent('.input-group').length) {
                error.insertAfter(element.parent());
            } else if (element.attr("type") == "radio") {
                error.insertAfter(element.parent().parent());
            }else{
                error.insertAfter(element);
            }
        }
    });

    function set(){
        console.log(params);
        $('input#data').val(moment(params.inicio).format('DD/MM/YYYY'));
        $('input#hora').val(moment(params.inicio).format("HH:mm"));
        $('span#finaliza').html(moment(params.fim).format("HH[h]mm[m]"));
    }

    function loadDuracao(){
        var options = '<option value="" disabled selected>Escolha</option>';
        for(var i=1;i<33;i++){
            var tempo = 15;
            var tmptotal = tempo * i;
            var hours = Math.floor(tmptotal/60);
            var minutes = tmptotal % 60;
            if(hours < 10)
              hours = hours;
            if(minutes < 10)
              minutes = "0"+minutes;
            if(parseInt(Math.abs((params.inicio.getTime() - params.fim.getTime()) / 60000)) == tmptotal){
                options += '<option value="'+tmptotal+'" selected>'+ hours+"h"+minutes+'m' +'</option>';    
            }else{
                options += '<option value="'+tmptotal+'">'+ hours+"h"+minutes+'m' +'</option>';
            }
        }
        $("#duracao").html(options);
    }

    //save
    $('button#salvar').livequery('click',function(event){
        // if($("form#formCliente").valid()){
        //     clientes = {
        //         id: $('#id').val(),
        //         nome: $('#nome').val(),
        //         sobrenome: $('#sobrenome').val(),
        //         cracha: $('#cracha').val(),
        //         telefone: $('#telefone').val(),
        //         sexo: $('#sexo').val(),
        //         pais: $('#pais').val(),
        //         estado: $('#estado').val(),
        //         cidade: $('#cidade').val()
        //     };

        //     //params
        //     var params = {};
        //     params = JSON.stringify(clientes);

        //     $('button#salvar').html('Processando...');
        //     $('button#salvar').prop("disabled",true);
        //     $('button#cancelar').prop("disabled",true);

            // app.util.getjson({
            //     url : "/controller/office/cliente/update",
            //     method : 'POST',
            //     contentType : "application/json",
            //     data: JSON.stringify(params),
            //     success: function(response){
            //         // if(response.success){
            //         //     setSession('success', response.success);
            //         //     window.location.href = "/office/cliente/edit/"+clientes.id;
            //         // }
            //     },
            //     error : function(response){
            //         // response = JSON.parse(response.responseText);
            //         // $('#error').removeClass('hidden');
            //         // $('#error').find('.alert p').html(response.error);
            //         // $('button#salvar').html('Salvar');
            //         // $('button#salvar').prop("disabled",false);
            //         // $('button#cancelar').prop("disabled",false);
            //     }
            // });
        // }else{
        //     $("form#formCliente").valid();
        // }
        return false;
    });

    //change client
    $('a#alterar-cliente').livequery('click',function(event){
        $(this).addClass('hidden');
        $('a#novo-cliente').removeClass('hidden');
        $('input#cliente').prop("disabled",false);
        $('input#cliente').val('');
        $('input#cliente').focus();
        //clear client params
        params.cliente = undefined;
        return false;
    });

    //change duration
    $('select#duracao').change(function(){
        var time = new Date((params.inicio.getTime()+($(this).val()*60*1000)));
        $('span#finaliza').html(moment(time).format("HH[h]mm[m]"));
    });

    //note
    $('a#action-note').livequery('click',function(event){
        if($('div#note').hasClass('hidden')){
            $(this).html('Ocultar nota');
            $('div#note').removeClass('hidden', 1000, "slow");
        }else{
            $(this).html('Adicionar nota');
            $('div#note').addClass('hidden', 1000, "slow");
        }
        return false;
    });

	function onError(response) {
      console.log(response);
    }

    //init
    set();
    loadDuracao();

});