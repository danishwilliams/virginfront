angular.module("app").config(['$translateProvider', function ($translateProvider) {
  // http://angular-translate.github.io/docs/#/guide/19_security
  $translateProvider.useSanitizeValueStrategy('sanitize');

  $translateProvider.translations('en', {
    // Routes
    // TODO: get these working
    'OB_PASSWORD': 'Password | Onboarding',
    'OB_CLUBS_TITLE': 'Clubs | Onboarding',
    'OB_GENRES': 'Genres | Onboarding',
    'OB_DONE': 'Get started | Onboarding',
    'RIDES': 'Rides',
    'RIDE_EDIT_TITLE': 'Ride edit',
    'TRACKS_SEARCH': 'Song search',
    'RIDE_TIME': 'Ride | Choose a time',
    'RIDE_CREATE_TITLE': 'Create ride',
    'RIDE_VIEW': 'View ride',
    'RIDE_SYNC': 'Sync ride',
    'TEMPLATE_PAGE': 'Template | Admin',
    'TEMPLATES_PAGE': 'Templates | Admin',
    'TEMPLATE_NEW_PAGE': 'Create New Template | Admin',
    'PROFILE_PAGE': 'User profile',
    'USER': 'User',
    'USERS': 'Users',
    'CREATE_USER': 'Create new user',

    // Onboarding
    'OB_STARTED': 'Get started',
    'OB_BROWSE_RIDES': 'Browse rides shared by others',
    'OB_KNOW': 'Help us get to know you a little.',
    'OB_CLUBS': 'Which clubs do you regularly teach at?',
    'OB_HEY': 'Hey',
    'OB_INVITED': "You've been invited to",
    'OB_TITLE_APP': 'Group Exercise Instructor App',
    'OB_ENDORSED': 'Up your game with <em>professionally endorsed ride terrain templates.</em>',
    'OB_SONGS': "It's never been this easy with over <em>1 million BPM tagged songs of all genres.</em>",
    'OB_SYNC': "<em>Sync your playlist directly to the studio,</em> no more hassling with CD's.",
    'OB_SETUP': "Let's get you set up!",
    'OB_HI': 'Hi',
    'OB_WELCOME': 'Welcome to Group Instructor app',
    'OB_CHOOSE_PASSWORD': 'Choose a password',
    'OB_FIRST_TIME': 'You will be asked to enter your email address and this password next time you log in',
    'PASSWORD_CONFIRM': 'Confirm password',
    'PASSWORD_SAVE': 'Save password',
    'PASSWORD_CONFIRM_REQ': 'Please confirm your password',
    'PASSWORDS_DONT_MATCH': "Your passwords don't match",
    'EMAIL_INVITE': 'Send email invitation',

    // Container page
    'HOME': 'Home',
    'TITLE': 'Management Console',
    'MENU': 'Menu',
    'CREATE_RIDE_MENU': 'Create a ride',
    'LOGOUT': 'Logout',
    'ERROR': 'The site is temporarily unavailable. Please try again later.',

    // Onboarding:
    'GENRES_HEADING': "What's your vibe?",
    'DONE': 'Done',

    // Login
    'LOGIN_TITLE': 'Instructor App sign in',
    'LOGIN_ERROR': 'Your username or password is incorrect.',
    'EMAIL': 'Email address',
    'PASSWORD': 'Password',
    'EMAIL_REQ': 'Please enter your email address.',
    'PASSWORD_REQ': 'Please enter your password.',
    'LOGIN': 'Log in',

    // Dashboard
    'DASHBOARD': 'Dashboard',
    'RECENT_RIDES': 'Recent rides',
    'VIEW_RIDES': 'View all your rides',
    'CREATE_RIDE': 'Create a new ride class',
    'RIDES_CLUBS': 'Rides available at Clubs',
    'MANAGE_CLUBS': 'Manage clubs',
    'RECENT_CLASSES': 'Recent classes',
    'VIEW_ALL_CLASSES': 'View all classes this month',
    'SHARED_RIDES': 'Rides shared by others',
    'BROWSE_RIDES': 'Browse all rides',
    'SELECT_RIDE': 'Select a ride to send to club',
    'REMOVE_RIDE': 'Remove',
    'UNDO': 'Undo',
    'CREATED': 'Created',
    'MINS_REMAINING': 'mins remaining',

    // My rides
    'MY_RIDES': 'My rides',

    // Navigation
    'BACK': 'Back',
    'CANCEL': 'Cancel',

    // Playlist workflow
    'PLAYLIST_1': 'Ride template',
    'PLAYLIST_2': 'Class length',
    'PLAYLIST_3': 'Create playlist',
    'PLAYLIST_4': 'Preview',
    'PLAYLIST_5': 'Send to club',

    // Playlist creation
    'CHOOSE_TEMPLATE': 'Choose a ride template',
    'CLASS_LENGTH': 'How long is your class?',
    'MINS': 'mins',

    // Playlist edit
    'RIDE_EDIT': 'Edit your playlist',
    'RIDE_CREATE': 'Create your playlist',
    'RIDE_NAME_REQ': 'The ride class needs a name.',
    //TODO: 'CLASS_LENGTH_ERROR': 'Try to get your class closer to {{playlist_edit.playlist.ClassLengthMinutes}} minutes by reviewing your track choices.',
    'CLASS_LENGTH_ERROR': '',
    'CLASS_GIVE_NAME': 'Give your class a name...',
    'GOAL_TRACK_REQ': 'Each goal needs a track.',
    'DRAG_DROP_TRACK': 'Add a track',
    'PLAY': 'Play',
    'BPM': 'BPM',
    'RPM': 'RPM',
    'LEG_SPEED': 'Leg speed',
    'TRACK_NOTES': 'Track notes',
    'ADD_SONG': 'Add a song',
    'CHALLENGE': 'Challenge',
    'NOTE_MAX': 'Max 200 characters',
    'RIDE_ERROR': 'Ride cannot be saved. Please try again later.',
    'NEXT_PREVIEW': 'Next: preview my ride',
    'UPDATE': 'Update changes',

    'BG_MUSIC': 'Background music',

    // Freestyle playlist
    'CREATE_GOAL': 'Create a goal',
    'CREATE_NEW_GOAL': 'Create a new goal',
    'SELECT_GOAL': 'Select a different goal',
    'ADD_GOAL': 'Add a goal',
    'CHALLENGE_GOALS': 'Challenge goals',

    // Track search
    'CHOOSE_TRACK': 'Choose a track for',
    'SEARCH': 'Search for a song',
    'SHOWING': 'Showing',
    'ADD_FILTER': 'Add filter',
    'HALF_TIME': 'Half time',
    'ON_THE_BEAT': 'On the beat',
    'GENRE_FILTER': 'Filter by genre',
    'SEARCH_ERROR': 'There was an issue with the song search. Please try again later.',

    // Playlist view
    'EDIT': 'Edit',
    'TRACKS': 'songs',
    'MINUTES_SMALL': 'minutes',
    'RETURN_DASHBOARD': 'Return to dashboard',
    'SEND_CLUB': 'Next: Send to club',

    // Playlist sync
    'SEND_CLUBS': 'Send to your clubs',
    'SAVE_SEND_CLUB': 'Save and send to clubs',
    'SAVE_CONTINUE_LATER': 'Save and continue later',
    // TODO: 'CLUB_RIDE_LIMIT_REACHED': '(This club already has {{playlist_sync.playlistLimitPerGym}} rides)',
    'CLUB_RIDE_LIMIT_REACHED': '',
    'SELECT_CLUBS_EXPLANATION': 'Select which clubs you would like to send your ride class to. This will make sure that all of your music and notes will be available on the tablet in the studio when you arrive.',
    'SELECT_CLUB_REQ': 'Please select at least one club',

    // User profile
    'LAST_CLASS': 'Last class',
    'CONTACT_DETAILS': 'Contact details',
    'SAVE': 'Save',
    'PERMISSIONS': 'Permissions',
    'RESIDENT_CLUBS': 'Resident clubs',
    'GENRES': 'Genres',
    'ACC_DETAILS': 'account details',
    'USERNAME': 'Username',
    'EMAIL_EXISTS': 'Email address already exists',
    'CONTACTS_SAVED': 'Contact details saved.',
    'PERMISSIONS_SAVED': 'Permissions saved.',
    'CLUBS_SAVED': 'Resident clubs saved.',
    'GENRES_SAVED': 'Genres saved.',
    'PHONE': 'Phone number',
    'CITY': 'City',

    // Adding a user
    'FIRST_NAME': 'First name',
    'LAST_NAME': 'Last name',
    'EMPLOYEE_ID': 'Employee ID',
    'FIRST_NAME_REQ': 'First name is required',
    'LAST_NAME_REQ': 'Last name is required',
    'GYMS': 'Clubs',
    'EMAIL_VALID': 'Please enter a valid email address',

    // Templates
    'TEMPLATES': 'Templates',
    'TEMPLATE': 'Template',
    'TEMPLATE_CREATE': 'Create new template',
    'TEMPLATE_TYPE_ARCHIVE': 'Archive this template type',
    'TEMPLATE_TYPE_UNARCHIVE': 'Archive this template type',
    'TEMPLATE_NAME': 'Template name',
    'TEMPLATE_NAME_REQ': 'Please give this template a name.',
    'DESCRIPTION': 'Description',
    'TEMPLATE_DESC_REQ': 'Please give this template a description.',
    'ICON': 'Icon',
    'ICON_REQ': 'Please choose an icon.',
    'TYPE': 'Type',
    'CLASS_LENGTH_ADD': 'Add class length',
    'NAME': 'Name',
    'CHANGE_GOAL': 'Change goal',
    'GOAL_NAME': 'Goal name',
    'GOAL_NAME_REQ': 'Please give this goal a name.',
    'BPM_REQ': 'BPM is required.',
    'INTERVAL_ADD': 'Add interval',
    'INTERVAL_REMOVE': 'Remove interval',
    'INTERVAL_REQ': 'This interval needs a name.',
    'EFFORT': 'Effort',
    'EFFORT_REQ': 'Please make an effort!',
    'RPM_REQ': 'Please pick an RPM.',
    'BEAT_RATIO': 'Beat ratio',
    'BEAT_RATIO_REQ': 'Please select a beat ratio.',
    'NOTES_GUIDELINE': 'Track notes guideline',
    'TEMPLATE_SAVE': 'Save template',
    'TEMPLATE_EDITED': 'Template successfully edited.',
    'TEMPLATE_ADDED': 'Template successfully added.',
    'TEMPLATE_SAVED': 'Template successfully saved!'
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