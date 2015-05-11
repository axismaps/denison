function sidebarEvents() {
	$( '#all-docs-button' ).on( 'click', function(){
		$( '#bar-expanded' ).hide();
		$( this ).addClass( 'selected' );
		$( '#reports-button' ).removeClass( 'selected' );
		$( '#secondary-buttons').find( '.selected' ).removeClass( 'selected' );
		
		allDocs();
	});
	
	$( '#reports-button' ).on( 'click', function(){
		$( this ).addClass( 'selected' );
		$( '#all-docs-button' ).removeClass( 'selected' );
		
		if( $( this ).hasClass( 'selected' ) && $( '#bar-expanded' ).is(':visible') && $( '#reports-expanded').is(':visible') ){
			$( '#bar-expanded' ).hide();
			$(this).removeClass( 'selected' );
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
		$( '.ui-accordion-content-active .image-expand' ).click();
	});
	
	$( '#about-button' ).on( 'click', function(){
		initAbout();
	});
}

function allDocs(){
	$( '.clear-text' ).click();
}

function initFilters(){
	$( '#filters-expanded' ).show();

	$( '#reports-button' ).removeClass( 'selected' );
	
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

function initAbout(){
	alert( 'About lightbox will show up here' );
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