$(document).ready(function() { 

  // инициализируем глобально (почти) объект, в который будем писать данные на отправку по почте (имя, телефон, модель, вид ремонта) из разных функций
  var data = {};

  $("#section-02-hero-img").animate({
      opacity: 1,
      right: 100
    }, 
    {
      duration: 1000
    }  
  );


  $("#content-02-02").animate({
      opacity: 1,
      left: 0
    }, 
    {
      duration: 1000
    }  
  );


  $(".js-click-order").on("click", function(e) {    
    if ($(this).hasClass("ontop")) { $("#overlay").css("z-index",190)}
    $("#overlay")
    .show()
    .animate({opacity:1});
    $("#form-container").fadeIn(200);
    // добавляем флаг активности формы (для логики закрытия)
    $("#form-container").addClass("form-active");
  });


  function closeForm () {
    // сразу проверяем не открыто ли thank-you сообщение
    if ($("#thank-you-container.thank-you-active").length) {
      console.log("закрываем спасибо");
      // закрываем сообщение
      $("#thank-you-container").removeClass("thank-you-active");
      $("#thank-you-container").fadeOut(200);
      // на всякий случай закрываем миниленд (хотя он может быть и не открытым)
      $(".lp-container#minilanding").removeClass("lp-active");
      $(".lp-container#minilanding").fadeOut(200);
      // на всякий перемещаем overlay под лендос (на исходную позицию)
      $("#overlay").css("z-index",100);
      // гасим оверлей
      $("#overlay")
      .animate({ opacity: 0 }, function () { $(this).hide() });
      // выходим из фунцкии досрочно
      return false;
    };
    // сразу проверяем не открыто ли окно "как определить модель" (не важно для какого ус-ва)
    if ($(".lp-container.help-lightbox.lp-active").length) {
      console.log("закрываем помощь");
      // закрываем окно
      $(".lp-container.help-lightbox").removeClass("lp-active");
      $(".lp-container.help-lightbox").fadeOut(200);
      // гасим оверлей
      $("#overlay")
      .animate({ opacity: 0 }, function () { $(this).hide() });
      // выходим из фунцкии досрочно
      return false;
    };
    // если минилендос открыт (по флагу активности который вешается при открытии)
    if ($("#minilanding.lp-container.lp-active").length) {      
      console.log("закрываем милиенд");
      // если открыта ещё и форма сверху
      if ($("#form-container.form-active").length) {
        // перемещаем overlay под лендос 
        $("#overlay").css("z-index",100);
        // и закрываем форму (лендос остаётся)
        $("#form-container").removeClass("form-active");
        $("#form-container").fadeOut(200);
      } else {
        // если формы уже нет - закрываем лендос и оверлей
        $(".lp-container#minilanding").removeClass("lp-active");
        $(".lp-container#minilanding").fadeOut(200);
        $("#overlay").animate({opacity: 0}, function () { $(this).hide() })
      }
    } else {
      // иначе - закрываем и оверлей и форму 
      $("#form-container").removeClass("form-active");
      $("#form-container").fadeOut(200);
      $("#overlay")
        .animate({ opacity: 0 }, function () { $(this).hide() })
    }
  };
  

  $(".close").on("click", closeForm);
  $("#overlay").on("click", closeForm);
  
  $(".js-click-phone").on("click", function (e) {    
    $("#form-tel-number")[0].click();
    // тригерим клик на самом DOM-эл-те, а не его $-врапере, иначе не сработает триггер https://stackoverflow.com/q/5811122/6056120
    // $-триггер не срабатывает на <a>текст ссылки</a>, только если текст внутри <a> засунуть еще в <span>, хз почему
  });


  $(".content-11-02-question").on("click", function (ev) {
    $(".content-11-02-answer").each(function() {
      $(this).slideUp(200);
    });
    $(this).next().slideDown(200);
  });


  $(".js-scroll-to-price").on("click", function (ev) {
    // скролл к прайсу с поправкой на высотку фикс плашки с лого (140)
    $('html, body').animate({
      scrollTop: $("#section-09").offset().top - 140
    }, 1000);
  });
  
  
  // переход между разделами прайса (афоны/айпады/макбуки)
  $(".button_to li").on("click", function (ev) {
    ev.preventDefault();
    // снимем active со всех элементов
    $(".button_to li").removeClass("active").removeClass("icon-ok");
    // повесим active на текущий эл-т
    $(this).addClass("active").addClass("icon-ok");
    // получим целевой раздел из href дочернего атрибута
    var curDeviceType = $(this).find("a[data-toggle='tab']").attr("href");
    console.log(curDeviceType);
    // спрячем все разделы
    $("div[role='tabpanel1']").fadeOut(200);
    // покажем раздел с текущим id раздела
    $("div[role='tabpanel1']" + curDeviceType).fadeIn(200);
    // сразу откроем прайс первой модели в открывшемся разделе через триггер клика по кнопке прайса первой модели
    $("div[role='tabpanel1']" + curDeviceType).find(".nav-item:eq(0)").click();
  });
  
  
  // переход по моделям устройства в прайсе
  $(".nav-item").on("click", function (ev) {
    $(".nav-item").removeClass('active-tab');
    $(this).addClass('active-tab');
    ev.preventDefault();
    // получим значение модели из атрибута дочернего тега
    var curModelID = $(this).find("a[role='tab']").attr("href");
    console.log(curModelID);
    // спрячем все разделы
    $("div[role='tabpanel']").fadeOut(200);
    // покажем раздел с текущеим id модели
    $("div[role='tabpanel']" + curModelID).fadeIn(200);
    // заполним первый столбец прайса названием модели и заодно очистим время ремонта в прайса айпадов
    // флаг нахождения в секции айпадов (пригодится в цикле ниже)
    var inIpadSection = false;
    if ($(this).parent().parent().attr('id') == "tab1") inIpadSection = true;
    // флаг нахождения в секции макбуков (пригодится в цикле ниже)
    var inImacSection = false;
    if ($(this).parent().parent().attr('id') == "tab2") inImacSection = true;
    // прочтём и запомним в переменную название текущей модели ус-ва
    var curModelName = $("div[role='tabpanel']" + curModelID).attr("model");
    // загоним таблицу прайса в переменную
    var priceTable = $("div[role='tabpanel']" + curModelID).find("table");
    // запомним кол-во строк в этой таблице
    var priceTableLen = priceTable.find("tr").length - 1;
    // запустим цикл по каждой строке таблицы
    // !let не работает на сафарях на айфонах ниже 7! ES2015! еле нашёл баг через браузертак - из-за этого js вылетал весь
    for (i = 1; i <= priceTableLen; i++) {
      // запишем в 1ю ячейку строки название текущей модели ус-ва
      priceTable.find("tr:eq("+i+") td:eq(0)").html(curModelName);
      // сотрём время ремонта во 2-й ячейке в прайсе айпада
      if (inIpadSection) {
        priceTable.find("tr:eq(" + i + ") td:eq(2)").html("уточняйте");
      };
      // время ремонта во 2-й ячейке в прайсе аймаков заменим на "уточняйте"
      if (inImacSection) {
        priceTable.find("tr:eq(" + i + ") td:eq(2)").html("уточняйте");
      };
    };
    // проскроллим ниже к началу кнопок моделей (к следующему табконтенту)
    // чтобы данный скролл не вызывался когда не надо, отделим реальные события click (те реальные клики мышкой по элементу) от вызыванных искусственно через метод click(), используя св-во originalEvent переданного объекта-события ev - при фейковых "кликах" это св-во у него отсутсвует
    // console.log(ev); // полный список св-в для анализа
    if (ev.originalEvent) {
      // срабатывает только на реальных кликах
      var priceScrollTo = $(this).parent().siblings(".tab-content");
      $('html, body').animate({
        scrollTop: priceScrollTo.offset().top - 100
      }, 1000)
    }
  });
  
  // триггернём нажатие по первой вкладке, чтобы в первом столбце прайса срендерилось название модели (иначе будет пустой столбец)
  $(".nav-item:eq(0)").click();
  
  
  // ХАКИ ДЛЯ ПРАЙСОВ
  
  // добавим класс no-hover к тем строкам, по которым не нужен клик (заголовки таблиц и тп), важно сделать это до привязки события клика, тк оно будет фильтровать именно по этому классу no-hover
  $("table.price-table").each(function() {
    $(this).find("tr:eq(0)").addClass("no-hover");
  });

  // далее только для маков - обернем каждую цену в <span class='hover'></span> чтобы цена смогла повляться в минилендинге (она считывается скриптом из спана внутри td) и чтобы после цены был знак рубля (он повешен на класс hover :after)
  $("div#tab2 table.price-table").each(function() {
    // итерация
    var rows = $(this).find("tr:gt(0):not(:contains('уточняйте'))"); // gt() чисто фишка jQuery, не css, вообще почитай про спецселекторы jQuery http://api.jquery.com/category/selectors/ там тьма клёвых
    // внутренний цикл по строкам в текущей таблице
    rows.each(function () {
      // запомним текущее содержимое ячейки с ценой
      var priceCell = $(this).find("td:eq(3)");
      var price = priceCell.html();
      newPrice = "<span class='hover'>"+price+"</span>";
      // запишем обёрнутое в спан содержимое обратно в ячейку
      priceCell.html(newPrice);
    });
    // последниие строки во всех прайсах маков делаем некликабельными - там стоит "уточняйте" вместо цены, нет смысла показывать стандартный миниленд
    $(this).find("tr:last-of-type").addClass("no-hover");
  });
  

  // отображение минилендинга по клику по модели
  $("tr:not(.no-hover)").on("click", function() {
    // "считаем" модель, наименование услуги и цену из содержимого 1, 2 и 4 столбцов
    var model = $(this).find("td:eq(0)").html();
    var service = $(this).find("td:eq(1)").html();
    var price = $(this).find("td:eq(3) span").html();
    // показать "стекло в подарок" в случае клика по услуге "замена дисплея"
    service == "Замена дисплея" ? $(".lp-steklo-podarok").css("display","inline-block") : $(".lp-steklo-podarok").hide();
    // загоняем вышеполученные цену и услугу в минилендос
    $("#lp-price-value").html(price);
    $("#lp-service").html(service);
    // анимируем подложку
    $("#overlay")
    .show()
    .animate({ opacity: 1 });
    // минилендос должен "всплыть" в 20 пикс от верха (не вплотную)
    // координаты верха окна https://stackoverflow.com/a/7019378/6056120
    var offsetY = $(document).scrollTop() + 110;
    // показываем минилендос через фэйдин
    $(".lp-container#minilanding").css("top",offsetY).fadeIn(200);
    // добавляем флаг активности для логики последующего закрытия
    $(".lp-container#minilanding").addClass("lp-active");
    // запишем в объект данные о модели, виде ремонта и цене
    data.model = model;
    data.service = service;
    data.price = price + " руб";
  });
  

  // при прокрутке фиксируем верхнюю плашку с логотипом
  $(document).on("scroll",function (ev) {
    $(this).scrollTop() > 600 ? $("#section-01").addClass("fixed") : $("#section-01").removeClass("fixed")
  });


  // валидация формы на пустые поля
  function isFormValid(form) {
    // инициализация флага валидности
    var formValid = true;
    // найдем в переданной форме все текстовые поля которые не могут быть пустыми
    var fieldSet = $(form).find("input[type=text].no-empty");
    // цикл по множеству найденных полей
    $(fieldSet).each(function () {
      if ($(this).val()) {
        $(this).removeClass("wrong")
       } else {
         $(this).addClass("wrong");
         formValid = false;
       }
    });
    return formValid;
  };

  
  // отправка формы
  $(".js-click-submit").on("click",function (ev) {
    // валидация
    if (!isFormValid("#form-container")) return false;
    // подготовка объекта данных
    data.name = $("input#name").val();
    data.tel = $("input#tel").val();
    console.log(data);
    // сохраним текущую надпись на кнопке чтобы вернуть ее после аякса
    caption = $(this).html();
    // аякс на почту
    $.ajax({
      method: 'POST',
      url: 'mail.php',
      data: data,
      // меняем надпись на кнопке на время аякса чтобы не нажимали повторно (в идеале ещё отвязывать событие от кнопки, а после аякса перепривязывать обратно)
      beforeSend: function () {
        $("#form-container .button").html("Отправляем...")
      }
    })
    .done( function(res) {
      console.log(res);
      // фейдом прячем форму
      $("#form-container").fadeOut(200, function () {
        // возвращаем надпись на кнопке (после фейда, а то видно)
        $("#form-container .button").html(caption);
      });
      // открываем благодарственное сообщение
      $("#thank-you-container").fadeIn(200);
      $("#thank-you-container").addClass("thank-you-active");
    });
  });

  // отправка формы в минидлендосе
  $(".js-click-submit-lp").on("click",function (ev) {
    var lpForm = $("#left-button");
    // валидация
    if (!isFormValid(lpForm)) return false;
    // подготовка объекта данных
    data.name = lpForm.find("input#name").val();
    data.tel = lpForm.find("input#tel").val();
    console.log(data);
    // сохраним текущую надпись на кнопке чтобы вернуть ее после аякса
    caption = $(this).html();
    // аякс на почту
    $.ajax({
      method: 'POST',
      url: 'mail.php',
      data: data,
      // меняем надпись на кнопке на время аякса чтобы не нажимали повторно (в идеале ещё отвязывать событие от кнопки, а после аякса перепривязывать обратно)
      beforeSend: function () {
        lpForm.find(".button").html("Отправляем...")
      }
    })
    .done( function(res) {
      console.log(res);
      // возвращаем надпись на кнопке (после фейда, а то видно)
      // lpForm.find(".button").html(caption);
      lpForm.find(".button").html("ОТПРАВЛЕНО");
    });
    // открываем благодарственное сообщение
    // $("#thank-you-container").fadeIn(200);
    // $("#thank-you-container").addClass("thank-you-active");
  });  

  $("#slider-instagram").owlCarousel({
    items: 1,
    // autoWidth: true,
    autoWidth: false, //  для адаптивного слайдера нужен false
    autoplay: true,
    autoplayTimeout: 10000,
    loop: true,
    autoplaySpeed: 1000,
    transitionStyle: 'backSlide'
  });

  $(".kak-uznat").on("click",function (ev) {
    var device = $(this).attr("data-device");
    var cont = $(".lp-container" + device);
    $("#overlay").show().animate({ opacity: 1 });
    var offsetY = $(document).scrollTop() + 110;
    cont.css("top", offsetY).fadeIn(200).addClass("lp-active");
  })
});

$(".help-lightbox span[data-model]").on("click",function (ev) {
  // прочитаем 
  var tabID = $(this).parents("ul").attr("data-tab-id");
  var model = $(this).attr("data-model");
  // найдем на панели моделей
  var liID = "li a[href='"+model+"']"; // в кавычках знач свойств в цсс
  // триггернем переход на выбранную модель в прайсе
  $(tabID).find(liID).parent().click();
  // зафейдим справку с оверлеем
  $(".help-lightbox").removeClass('lp-active');
  $(".help-lightbox").fadeOut(200);
  $("#overlay").fadeOut(200);
  // после перехода на модель хорошо бы ещё подскролить прайс к верху окна
});