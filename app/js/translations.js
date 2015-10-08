angular.module("app").config(['$translateProvider', function ($translateProvider) {
  // http://angular-translate.github.io/docs/#/guide/19_security
  $translateProvider.useSanitizeValueStrategy('sanitize');

  $translateProvider.translations('en', {
    'TITLE': 'Hello',
    'FOO': 'This is a paragraph',

    // Navigation
    'BACK': 'Back',

    // Playlists
    'PLAYLIST_1': 'Ride template',
    'PLAYLIST_2': 'Class length',
    'PLAYLIST_3': 'Goals & music',
    'PLAYLIST_4': 'Review & save',
    'CLASS_GIVE_NAME': 'Give your class a name...',
    'DRAG_DROP_TRACK': 'Drag and drop your track here',
    'PLAY': 'Play',
    'BPM': 'BPM',
    'RPM': 'RPM',
    'LEG_SPEED': 'Leg speed',
    'ADD_NOTES': 'Add more notes',
    'CHOOSE_TRACK': 'Choose a track for',
    'SEARCH': 'search',
    'TRACKS': 'songs',
    'SHOWING': 'showing',
    'ADD_FILTER': 'Add filter'
  });
 
  $translateProvider.translations('es', {
    'TITLE': 'Hola',
    'FOO': 'Este es un párrafo',

    // Navigation
    'BACK': 'Atrás',

    // Playlists
    'RIDE_TEMPLATE': 'Plantilla Ride',
    'PLAYLIST_CREATE': 'Crear lista de reproducción',
    'PLAYLIST_REVIEW': 'Reseña',
    'PLAYLIST_PUBLISH': 'Publicar a dispositivo',
    'CLASS_GIVE_NAME': 'Dale a tu clase un nombre',
    'DRAG_DROP_TRACK': 'Arrastre y suelte la pista aquíhere',
    'PLAY': 'Jugar',
    'BPM': 'BPM',
    'RPM': 'RPM',
    'LEG_SPEED': 'Velocidad de las piernas',
    'ADD_NOTES': 'Añadir más notas',
    'CHOOSE_TRACK': 'Elija una pista para',
    'SEARCH': 'buscar',
    'TRACKS': 'canciones',
    'SHOWING': 'demostración',
    'ADD_FILTER': 'Añadir filtro'
  });
 
  $translateProvider.preferredLanguage('en');
}]);