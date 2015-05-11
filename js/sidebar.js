function initSidebar(){
	$( '#filters-button' ).show();
	$( '#tags-button' ).show();
	$( '#summary-button' ).hide();
}

function sidebarEvents() {
	$( '#all-docs-button' ).on( 'click', function(){
		$( '#bar-expanded' ).hide();
		$( this ).addClass( 'selected' );
		$( '#reports-button' ).removeClass( 'selected' );
		$( '#secondary-buttons').find( '.selected' ).removeClass( 'selected' );
		$( '#secondary-buttons div' ).hide();
		$( '#filters-button' ).show();
		$( '#tags-button' ).show();
		
		allDocs();
	});
	
	$( '#reports-button' ).on( 'click', function(){
		$( this ).addClass( 'selected' );
		$( '#all-docs-button' ).removeClass( 'selected' );
		
		$( '#secondary-buttons div' ).hide();
		$( '#summary-button' ).show();
		
		if( $( this ).hasClass( 'selected' ) && $( '#bar-expanded' ).is(':visible') && $( '#secondary-buttons').children( '.selected' ).length == 0 ){
			$( '#bar-expanded' ).hide();
		} 
		else if( $( '#secondary-buttons').children( '.selected' ).length > 0 ) {
			$( '#secondary-buttons').children( '.selected' ).removeClass( 'selected' );
			$( '#bar-expanded > div' ).hide();
			initReports();
		}
		else {
			$( '#bar-expanded > div' ).hide();
			$( '#bar-expanded' ).show();
			initReports();
		}
	});
	
	$( '#filters-button' ).on( 'click', function(){
		if( $( this ).hasClass( 'selected' ) ){
			$( '#bar-expanded' ).hide();
			$( this ).removeClass( 'selected' );
		}
		else {
			$( this ).siblings( '.selected' ).removeClass( 'selected' );
			$( this ).addClass( 'selected' );
			
			$( '#bar-expanded > div' ).hide();
			$( '#bar-expanded' ).show();
			initFilters();
		}
	});
	
	$( '#tags-button' ).on( 'click', function(){
		if( $( this ).hasClass( 'selected' ) ){
			$( '#bar-expanded' ).hide();
			$( this ).removeClass( 'selected' );
		}
		else {
			$( this ).siblings( '.selected' ).removeClass( 'selected' );
			$( this ).addClass( 'selected' );
			
			$( '#bar-expanded > div' ).hide();
			$( '#bar-expanded' ).show();
			initTags();
		}
	});
	
	$( '#summary-button' ).on( 'click', function(){
		if( $( this ).hasClass( 'selected' ) ){
			$( '#bar-expanded' ).hide();
			$( this ).removeClass( 'selected' );
		}
		else {
			$( this ).siblings( '.selected' ).removeClass( 'selected' );
			$( this ).addClass( 'selected' );
			
			$( '#bar-expanded > div' ).hide();
			$( '#bar-expanded' ).show();
			initSummary();
		}
	});
	
	$( '#about-button' ).on( 'click', function(){
		initAbout();
	});
}

function allDocs(){
	$( '.clear-text' ).click();
}

function initReports(){
	$( '#reports-expanded' ).show();
	if ( $( "#reports-accordion" ).length ) return;
	
	$( '<div/>', {
		id: "reports-accordion"
	}).appendTo( '#reports-expanded .expanded-section' );
	
	$.map( DataVars.data.entries, function( v ) {
		var $title = $( '<h3><i class="fa fa-folder"></i> <span>' + v.title + '</span></h3>' ).appendTo( '#reports-accordion' );
		
		$( '#reports-accordion' ).append( '<div class="reports-accordion-content"/>' );
		
		var url = 'php/loadImage.php?id=' + v.pointer + '&size=small';
		var width = $( '#reports-accordion' ).width();
		
		$( '<div/>', {
			'class' : 'accordion-image image-container'
		}).appendTo( '#reports-accordion > div:last-child' ).css({
			'background-image':  'url(' + url + ')',
			width: width + 'px',
			height: width + 'px'
		});
		
		$( '<div/>' )
			.appendTo( '#reports-accordion > div:last-child > div' )
			.attr( 'class', 'image-expand' )
			.html( '<i class="fa fa-expand fa-2x"></i>' )
			.on( 'click', function(){
				//TODO: Show lightbox of report summary
				lightboxReport( $(this).parent().parent(), v );
		});

		$title.css( 'background-image', 'url(' + url + ')' )
			.prepend( '<div class="mask">' );

		var $textContainer = $( '<div class="text-container">' )
			.appendTo( '#reports-accordion > div:last-child' );
		
		$( '<p/>' ).appendTo( $textContainer  ).text( v.descri ).succinct({
			size: 300
		});
		
		$( '<div/>', {
				'class': 'button',
				html : 'View Report <i class="fa fa-chevron-right"></i>'
		}).appendTo( $textContainer  )
		.on( 'click', function(){
			//TODO: Show full report on click
			console.log( v );
		});
	});
	
	$( '#reports-accordion' ).accordion({
		heightStyle: "content",
		icons: false
	});
}

function initFilters(){
	$( '#filters-expanded' ).show();
	
	if ( $('#filters-expanded .expanded-section').children().length ) return;
	$( '.expanded-section' ).empty();
	
	//Date Slider
	$( '#date-range' ).append( '<div class="line"><span class="h4-title">Date Range</span><span class="clear-text">Clear</span></div>' );
	
	$( '#date-range .clear-text' ).on( 'click', function(){
		$( '#date-slider' ).slider( "values", [DataVars.data.minYear, DataVars.data.maxYear] );
		$( '#minYear' ).text( $( '#date-slider' ).slider( 'values', 0 ) );
		$( '#maxYear' ).text( $( '#date-slider' ).slider( 'values', 1 ) );
		
		DataVars.filters.minYear = $( '#date-slider' ).slider( 'values', 0 );
		DataVars.filters.maxYear = $( '#date-slider' ).slider( 'values', 1 );
		filter();
	});
	
	$( '#date-range' ).append( 
		'<span id="minYear"></span>', 
		'<div id="date-slider"></div>',
		'<span id="maxYear"></span>'
	);
	$( '#date-slider' ).slider({
		range: true,
		min: DataVars.data.minYear,
		max: DataVars.data.maxYear,
		values: [ DataVars.data.minYear, DataVars.data.maxYear ],
		slide: function( event, ui ){
			$( '#minYear' ).text( ui.values[ 0 ] );
			$( '#maxYear' ).text( ui.values[ 1 ] );
		},
		stop: function( event, ui ){
			DataVars.filters.minYear = ui.values[ 0 ];
			DataVars.filters.maxYear = ui.values[ 1 ];
			filter();
		}
	});
	$( '#minYear' ).text( $( '#date-slider' ).slider( 'values', 0 ) );
	$( '#maxYear' ).text( $( '#date-slider' ).slider( 'values', 1 ) );
	
	//Formats
	$( '#format' ).append( '<div class="line"><span class="h4-title">Format</span><span class="clear-text">Clear</span></div>' );
	
	$( '#format .clear-text' ).on( 'click', function() {
		$( '#format p.selected' ).removeClass( 'selected' ).children( 'i' ).remove();
		DataVars.filters.format = [];
		filter();
	});
	
	
	$.map( DataVars.data.formats.sort(), function( v ){
		$('<p/>' , {
			html: '<span class="format-item">' + getIcon( v ) + v + '</span>'
		})
		.appendTo( $( '#format' ) )
		.on( 'click', function() {
			var text = $( this ).children( ' .format-item' ).text(),
				html = $( this ).children( ' .format-item' );
			$( this ).empty().html( html );
			
			if( $( this ).hasClass( 'selected' ) ){
				$( this ).removeClass( 'selected' );
				DataVars.filters.format = _.without( DataVars.filters.format, text );
				filter();
			} else {
				$( this ).append( "<i class='fa fa-check'></i>" );
				$( this ).addClass( 'selected' );
				DataVars.filters.format.push( text );
				filter();
			}
		});
	});
}

function initTags(){
	$( '#tags-expanded' ).show();
	
	var sect = $( '#tags-expanded .expanded-section' );
	if ( sect.children().length ) return;
	sect.empty();
	
	sect.append( '<div class="line"><span class="h4-title">Tags</span><span class="clear-text">Clear</span></div>' );
	
	$( '#tags-expanded .expanded-section .clear-text' ).on( 'click', function() {
		$( '#tags-expanded .expanded-section p.selected' ).removeClass( 'selected' ).children( 'i' ).remove();
		DataVars.filters.tags = [];
		filter();
	});
	
	$.map( DataVars.data.tags, function( v ){
		$('<p/>' , {
			text: v
		})
		.attr( 'class', 'tag' )
		.appendTo( sect )
		.on( 'click', function() {
			var text = $( this ).text();
			$( this ).empty().text( text );
			
			if( $( this ).hasClass( 'selected' ) ){
				$( this ).removeClass( 'selected' );
				DataVars.filters.tags = _.without( DataVars.filters.tags, $( this ).text() );
				filter();
			} else {
				$( this ).append( "<i class='fa fa-check'></i>" );
				$( this ).addClass( 'selected' );
				DataVars.filters.tags.push( $( this ).text() );
				filter();
			}
		});
	});
}

function initSummary(){
	$( '#summary-expanded' ).show();
}

function initAbout(){
	var mask = $( "<div class='lightbox-mask lightbox'>" )
		.appendTo( "body" )
		.click( function(){
			$( ".lightbox" ).remove();
		});
	var w = .8 * $(window).width(),
		h = .8 * $(window).height();
	
	var $div = $( '<div />' ).addClass( "lightbox" )
		.css({
			position: "absolute",
			left: '100px',
			top: '100px',
			"margin-top": 0,
			"margin-left": 0,
			width: 300,
			transition: "none",
			padding: 0
		})
		.appendTo("body")
		.animate({
			left: "50%",
			top: "50%",
			"margin-left": -w/2 -20,
			"margin-top": -h/2 - 20,
			width: w,
			height: h,
			padding: 20
		})
		.html( 'Lorem ipsum dolor sit amet, in eripuit corrumpit mea, ei vis facilisis voluptaria. At sea aperiam accusata, quo eius reque prodesset at. Pertinacia adolescens te his, quod wisi mnesarchum ne mea. Diceret commune accommodare vix et. Vidit forensibus at vel, cum in alii erroribus gloriatur. Modus idque no mei, alia minim sadipscing usu an.<br />Convenire reprehendunt in mea. Sit commune placerat et. Ea duo etiam expetendis deterruisset. Ut populo graecis vim.<br /> Summo fastidii eloquentiam in pro. Duo omnesque luptatum ut, no dicant facete intellegebat mel. Mea quando pertinax maluisset ex, eros ponderum assentior ne mei. Eu usu omittam iudicabit.<br /> Everti blandit eu eum. Erat salutatus vix cu, in veri scaevola his, usu placerat verterem ex. Omnes inimicus et nec, est at mutat mucius utamur. Te nostrum salutandi assueverit mea, mundi veritus deseruisse usu ea. Has elit falli omittantur te, an duo legere essent. Pri ea illud reque.' );
}

function getIcon( text ){
	switch( text ){
			case "Art":
				return '<i class="fa fa-paint-brush"></i>';
			case "Article":
			case "article":
				return '<i class="fa fa-newspaper-o"></i>';
			case "Biography":
			case "Book":
			case "book":
				return '<i class="fa fa-book"></i>';
			case "Letter":
				return '<i class="fa fa-envelope-o"></i>';
			case "Museum Record":
				return '<i class="fa fa-archive"></i>';
			case "Official Record":
				return '<i class="fa fa-university"></i>';
			case "Photograph":
			case "Photography":
				return '<i class="fa fa-picture-o"></i>';
			case "Postcard":
				return '<i class="fa fa-envelope-o"></i>';
			default:
				return '<i class="fa fa-file-o"></i>'; 
	}
}