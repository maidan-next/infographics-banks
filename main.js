(function($, window) {

  var MAP_SOURCE = 'ukraine.json',
      
      COLORS = {
        'captured': d3.rgb(241, 196, 15),
        'clashes' : d3.rgb(192, 57, 43),
        'protests': d3.rgb(230, 126, 34),
        'lost'    : d3.rgb(44, 62, 80),
        'default' : d3.rgb(236, 240, 241),
        'borders' : d3.rgb(127, 140, 141)
      },

      NAMES = {
        'Cherkasy': 'Черкаська область',
        'Chernihiv': 'Чернiгiвська область',
        'Chernivtsi': 'Чернiвецька область',
        'Crimea': 'Автономна Республiка Крим',
        'Dnipropetrovsk': 'Днiпропетровська область',
        'Donetsk': 'Донецька область',
        'Ivano-Frankivsk': 'Iвано-Франкiвська область',
        'Kharkiv': 'Харкiвська область',
        'Kherson': 'Херсонська область',
        'Khmelnytskyy': 'Хмельницька область',
        'Kyiv': 'Київська область',
        'KyivCity': 'Київ',
        'Kirovohrad': 'Кiровоградська область',
        'Luhansk': 'Луганська область',
        'Lviv': 'Львiвська область',
        'Mykolayiv': 'Миколаївська область',
        'Odessa': 'Одеська область',
        'Poltava': 'Полтавська область',
        'Rivne': 'Рiвненська область',
        'Sevastopol': 'Севастополь',
        'Sumy': 'Сумська область',
        'Ternopil': 'Тернопiльська область',
        'Transcarpathia': 'Закарпатська область',
        'Vinnytsya': 'Вiнницька область',
        'Volyn': 'Волинська область',
        'Zaporizhzhya': 'Запорiзька область',
        'Zhytomyr': 'Житомирська область'
      };

      var events = [
        {
          id : 1,
          name : "Joined Faecbook",
          on : new Date(2014,2,15)
        },
        {
          id : 11,
          name : "Up",
          on : new Date(2014,2,17)
        },
        {
          id : 2,
          name : "Joined Twitter",
          on : new Date(2014,5,30)
        },
        {
          id : 9,
          name : "Created a new blogger account",
          on : new Date(2014,7,5)
        }
      ];

  $(function() {
    
    // INIT MAP

    var map = d3.select('.map').append('svg'),

      margin = { top: 10, left: 10, bottom: 10, right: 10 },
      width = parseInt(map.style('width'), 10),
      height = parseInt(map.style('height'), 10),

      offsetTop = 400;

    // INIT TIMELINE

    var $timeline = $('.timeline');

    $timeline.jqtimeline({
      'events': events,
      'numYears': 1,
      'startYear': 2014,
      'click': function(e, event){
        // alert(event.name);
      }
    });

    var timeline = $timeline.data('jqtimeline');

    // QUERY & DRAW MAP

    d3.json(MAP_SOURCE, function(error, ua) {

      // DRAW MAP

      var subunits = topojson.feature(ua, ua.objects.states);
      
      var projection = d3.geo.mercator()
        .center([31.03, 46.07])
        .translate([width / 2, offsetTop])
        .scale(2000);

      var path = d3.geo.path()
        .projection(projection);

      map
        .style('width', width)
        .style('height', height);

      map.append('g')
        .attr('class', 'states')
        .selectAll('path')
        .data(subunits.features)
        .enter()
          .append('path')
          .attr('d', path)
          .attr('class', function(d) { return d.properties.oblname })
          .style('fill', function(d) { return COLORS['default']; })
          .style('stroke', function(d) { return COLORS['borders']; })
          .append('svg:title')
            .text(function(d) { return NAMES[d.properties.oblname]; });

      // SHOW DATA

      function renderFrame(data) {
        for (key in data) {
          if (data.hasOwnProperty(key)) {          
            map.select('.' + key).style('fill', function(d) { return COLORS[data[key]] });
          }
        }
      };

      renderFrame({
        'Crimea': 'captured',
        'KyivCity': 'protests',
        'Lviv': 'clashes',
        'Kharkiv': 'lost'
      });
    });  
  });
})($, window);