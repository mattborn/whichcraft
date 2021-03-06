var Type = {
  large: 22,
  medium: 18,
  normal: 15,
  small: 13
};
var Colors = {
  white: '#fff',
  light: '#bbb',
  faint: '#eee',
  dark: '#444',
  error: '#d44'
};
var maxLandscape = {
  maxWidth: 736,
  margin: '0 auto'
};
var scrollStyles = {
  height: '100%',
  WebkitOverflowScrolling: 'touch',
  overflowX: 'hidden',
  overflowY: 'auto'
};
var testData = {
  users: [
    {
      name: 'Matt Born',
      email: 'demo@whichcraft.com',
      hash: '3d9a2c9ab8f75b0d2015eae5d3649e00',
      joined: 'November 2014',
      notes: [
        {
          brew: 'Zombie Dust',
          brewery: '3 Floyds Brewing Co.',
          notes: 'Favorite beer by far.',
          liked: true
        },
        {
          brew: 'Stone Enjoy By 04.20.15 IPA',
          brewery: 'Stone Brewing Co.',
          notes: 'Drink extra-super-tasty Stone Enjoy By IPA well before its shelf life to maximize the pungent glory that this beautiful, intense hop profile provides.',
          liked: true
        }
      ]
    }
  ]
};

var firebase = new Firebase('https://whichcraft.firebaseio.com');

var App = React.createClass({
  mixins: [ReactFireMixin],
  getInitialState: function () {
    return {
      menuOpen: false,
      popoverOpen: false,
      page: 'brews',
      popover: 'add',
      user: null,
      notes: [],
      currentNote: 0
    };
  },
  componentWillMount: function() {
    var self = this;
    firebase.onAuth(function (user) {
      if (user) {
        var brews = [];
        self.bindAsObject(firebase.child('users').child(user.uid), 'user');
        self.bindAsArray(firebase.child('users').child(user.uid).child('notes'), 'notes');
        self.setState({
          uid: user.uid,
        });
      } else {
        self.setState({
          user: false,
          uid: null,
          notes: []
        });
      }
    });
  },
  componentDidMount: function() {
    key('esc', this._closePopover);
  },
  componentWillUnmount: function() {
    key.unbind('esc', this._closePopover);
  },
  openPage: function (page, toggleMenu, e) {
    this.setState({page: page});
    if (toggleMenu) this._toggleMenu(e);
  },
  _openPopover: function (popover, e) {
    this.setState({
      popover: popover,
      popoverOpen: true
    });
    e.preventDefault();
  },
  _closePopover: function (e) {
    this.setState({
      popover: null,
      popoverOpen: false
    });
    e.preventDefault();
  },
  _toggleMenu: function (e) {
    this.setState({menuOpen: !this.state.menuOpen});
    e.preventDefault();
  },
  _setCurrentNote: function(note, e) {
    this.setState({currentNote: note});
    this._openPopover('brew', e);
    e.preventDefault();
  },
  render: function () {
    console.log('App:render', this.state);
    var style = {
      app: {
        height: '100%',
        width: '100%',
        position: 'absolute',
        overflow: 'hidden',
        padding: '81px 0 0'
      },
      popover: {
        width: '100%',
        background: Colors.white,
        position: 'absolute',
        top: 0,
        left: this.state.popoverOpen ? 0 : '100%',
        transition: 'left .6s cubic-bezier(.1,1,.1,1)',
        transform: 'translateZ(0)'
      }
    };
    _.extend(style.popover, scrollStyles);
    var user = this.state.user;
    var pages = {
      brews: <Brews app={this} notes={this.state.notes} />,
      breweries: <Breweries />,
      feedback: <Feedback />,
      account: <Account app={this} user={user} />,
      upgrade: <Upgrade app={this} />,
      status: <Status />
    };
    var popovers = {
      add: <BrewForm app={this} user={this.state.uid} />,
      edit: <BrewForm app={this} user={this.state.uid} note={this.state.notes[this.state.currentNote]} noteId={this.state.user ? Object.keys(this.state.user.notes)[this.state.currentNote] : null} />,
      brew: <Brew app={this} note={this.state.notes[this.state.currentNote]} />,
      confirm: <Confirm />
    };
    if (user === null) {
      return <Loading />;
    } else {
      return user ? (
        <div
          style={style.app}
          onKeyDown={this._keydown}>
          {pages[this.state.page]}
          <Menu app={this} />
          <div style={style.popover}>
            {popovers[this.state.popover]}
          </div>
        </div>
      ) : (
        <Login app={this} />
      );
    }
  }
});

var Center = React.createClass({
  render: function () {
    var style = {};
    if (this.props.column) _.extend(style, {
      WebkitFlexFlow: 'column',
      flexFlow: 'column'
    });
    return (
      <div className="flex-center" style={style}>
          {this.props.children}
      </div>
    );
  }
});

var Login = React.createClass({
  getInitialState: function () {
    return {
      error: false,
      validated: false
    };
  },
  _validate: function () {
    var email = this.refs.email.getDOMNode().value;
    var password = this.refs.password.getDOMNode().value;
    if (email && password) {
      this.setState({validated: true});
    } else {
      this.setState({validated: false});
    }
    this.setState({error: false});
  },
  _submit: function (e) {
    var self = this;
    e.preventDefault();
    firebase.authWithPassword({
      email: this.refs.email.getDOMNode().value,
      password: this.refs.password.getDOMNode().value
    }, function (error, user) {
      if (error) {
        self.setState({error: true});
      }
    });
  },
  render: function () {
    var style = {
      login: { padding: '0 40px' },
      head: { padding: '80px 0 40px' },
      logomark: {
        width: 80,
        height: 80,
        display: 'block',
        margin: '0 auto 20px'
      },
      logotype: {
        width: 154,
        height: 25
      },
      submit: {
        margin: '0 0 20px'
      },
      forgot: {
        width: '100%',
        margin: '0 0 20px',
        textAlign: 'left'
      }
    };
    return (
      <div style={style.login}>
        <div style={style.head}>
          <Logomark style={style.logomark} />
          <Logotype style={style.logotype} />
        </div>
        <form onSubmit={this._submit}>
          <Input
            onChange={this._validate}
            placeholder='email'
            ref='email'
            treatment='thin'
            type='email' />
          <Input
            onChange={this._validate}
            placeholder='password'
            ref='password'
            treatment='thin'
            type='password' />
          <Button
            disabled={!this.state.validated}
            style={style.submit}
            text='Sign in'
            treatment='submit'
            type='submit' />
        </form>
        {this.state.validated && <Link style={style.forgot} text='Forgot password' />}
        {this.state.error && <Alert text='Bummer. Wrong email or password.' treatment='error' />}
      </div>
    );
  }
});

var Loading = React.createClass({
  render: function () {
    var style = {
      width: 40,
      height: 40,
      margin: '0 auto'
    };
    return (
      <Center>
        <img src="ball-triangle.svg" style={style} />
      </Center>
    );
  }
});

var Logomark = React.createClass({
  render: function () {
    return (
      <svg style={this.props.style} viewBox='0 0 100 96'>
        <path d='M86,2h1c0.6,0,1-0.4,1-1s-0.4-1-1-1H11c-0.6,0-1,0.4-1,1s0.4,1,1,1h1C12,2,0,34,0,50c0,30,22.4,46,50,46s50-16,50-46C100,34,86,2,86,2z'/>
      </svg>
    );
  }
});

var Logotype = React.createClass({
  render: function () {
    var style = {
      width: 130,
      height: 20
    };
    return (
      <svg style={_.extend(style, this.props.style)} viewBox='0 0 100 10.6'>
        <path d='M5.3,9.2c-0.3,0.9-0.6,1.3-1.6,1.3c-1,0-1.3-0.5-1.5-1.4L0.1,1.6C0,1.4,0,1.1,0,0.9c0-0.5,0.3-0.8,1.3-0.8
          c1,0,1.3,0.3,1.4,1.2L4,7.1l1.7-5.5c0.2-0.7,0.4-1.1,1.4-1.1c1,0,1.2,0.4,1.4,1.1l1.7,5.5l1.3-5.8c0.2-0.9,0.4-1.2,1.4-1.2
          c0.9,0,1.3,0.3,1.3,0.8c0,0.2,0,0.4-0.1,0.6l-2.1,7.6c-0.3,1-0.5,1.4-1.6,1.4c-1.1,0-1.4-0.4-1.7-1.3L7,4.1L5.3,9.2z M25,9.2
          c0,0.4,0,0.7-0.2,1c-0.2,0.3-0.5,0.4-1.1,0.4c-0.5,0-0.9-0.1-1.1-0.4c-0.2-0.3-0.2-0.6-0.2-1v-3h-4.2v3c0,0.4,0,0.7-0.2,1
          c-0.2,0.3-0.5,0.4-1.1,0.4c-0.5,0-0.9-0.1-1.1-0.4c-0.2-0.3-0.2-0.6-0.2-1V1.5c0-0.4,0-0.7,0.2-1c0.2-0.3,0.5-0.4,1.1-0.4
          c0.5,0,0.9,0.1,1.1,0.4c0.2,0.3,0.2,0.6,0.2,1v2.5h4.2V1.5c0-0.4,0-0.7,0.2-1c0.2-0.3,0.5-0.4,1.1-0.4c0.5,0,0.9,0.1,1.1,0.4
          C25,0.7,25,1,25,1.5V9.2z M30.1,9.2c0,0.4,0,0.7-0.2,1c-0.2,0.3-0.5,0.4-1.1,0.4c-0.5,0-0.9-0.1-1.1-0.4c-0.2-0.3-0.2-0.6-0.2-1V1.5
          c0-0.4,0-0.7,0.2-1c0.2-0.3,0.5-0.4,1.1-0.4c0.5,0,0.9,0.1,1.1,0.4c0.2,0.3,0.2,0.6,0.2,1V9.2z M37.3,8.4c0.4,0,0.8-0.1,1.2-0.2
          c0.5-0.2,0.8-0.4,1.1-0.4c0.6,0,1,0.8,1,1.3c0,0.4-0.3,0.7-0.7,1c-0.7,0.4-1.8,0.6-2.7,0.6c-2.9,0-5.2-1.9-5.2-5.3
          c0-3.5,2.5-5.3,5.2-5.3c1,0,2,0.2,2.7,0.6c0.5,0.3,0.7,0.6,0.7,1c0,0.5-0.3,1.3-1,1.3c-0.3,0-0.7-0.2-1.2-0.4
          c-0.4-0.2-0.8-0.3-1.3-0.3c-1.4,0-2.7,0.9-2.7,3C34.5,7.4,35.8,8.4,37.3,8.4z M51.5,9.2c0,0.4,0,0.7-0.2,1c-0.2,0.3-0.5,0.4-1.1,0.4
          c-0.5,0-0.9-0.1-1.1-0.4C49,9.9,49,9.6,49,9.2v-3h-4.2v3c0,0.4,0,0.7-0.2,1c-0.2,0.3-0.5,0.4-1.1,0.4c-0.5,0-0.9-0.1-1.1-0.4
          c-0.2-0.3-0.2-0.6-0.2-1V1.5c0-0.4,0-0.7,0.2-1c0.2-0.3,0.5-0.4,1.1-0.4c0.5,0,0.9,0.1,1.1,0.4c0.2,0.3,0.2,0.6,0.2,1v2.5H49V1.5
          c0-0.4,0-0.7,0.2-1c0.2-0.3,0.5-0.4,1.1-0.4c0.5,0,0.9,0.1,1.1,0.4c0.2,0.3,0.2,0.6,0.2,1V9.2z'/>
        <path d='M58.8,8.4c0.4,0,0.8-0.1,1.2-0.2c0.5-0.2,0.8-0.4,1.1-0.4c0.6,0,1,0.8,1,1.3c0,0.4-0.3,0.7-0.7,1
          c-0.7,0.4-1.8,0.6-2.7,0.6c-2.9,0-5.2-1.9-5.2-5.3C53.5,1.8,56,0,58.7,0c1,0,2,0.2,2.7,0.6c0.5,0.3,0.7,0.6,0.7,1
          c0,0.5-0.3,1.3-1,1.3c-0.3,0-0.7-0.2-1.2-0.4c-0.4-0.2-0.8-0.3-1.3-0.3c-1.4,0-2.7,0.9-2.7,3C56,7.4,57.3,8.4,58.8,8.4z M66.3,9.2
          c0,0.4,0,0.7-0.2,1c-0.2,0.3-0.5,0.4-1,0.4c-0.6,0-0.9-0.2-1-0.4c-0.2-0.3-0.2-0.6-0.2-1V1.7c0-0.5,0-1.1,0.9-1.4
          c0.4-0.1,1.1-0.2,2-0.2c0.9,0,1.8,0.1,2.7,0.5c1,0.5,1.6,1.4,1.6,2.7s-0.6,2.3-1.7,2.8l2.3,3.2c0.4,0.6,0.2,1.3-1,1.3
          c-0.9,0-1.3-0.4-1.7-1l-1.3-1.9c-0.3-0.4-0.6-0.9-0.6-0.9h-1V9.2z M66.3,4.7c0,0,0.2,0,0.4,0c1.3,0,1.9-0.4,1.9-1.3
          c0-0.9-0.7-1.2-1.6-1.2c-0.4,0-0.7,0-0.7,0V4.7z M79.7,8.1h-3.6l-0.5,1.3c-0.3,0.8-0.6,1.2-1.5,1.2c-0.8,0-1.1-0.3-1.1-0.7
          c0-0.2,0-0.3,0.2-0.6l3.3-7.9c0.3-0.7,0.6-1.2,1.5-1.2c0.9,0,1.2,0.4,1.5,1.2l3.2,7.9c0.1,0.2,0.1,0.4,0.1,0.6
          c0,0.5-0.4,0.8-1.2,0.8c-0.8,0-1.1-0.3-1.5-1.2L79.7,8.1z M76.8,6.1h2.2l-1.1-2.9L76.8,6.1z M86.6,9.2c0,0.4,0,0.7-0.2,1
          c-0.2,0.3-0.5,0.4-1,0.4c-0.5,0-0.9-0.1-1-0.4c-0.2-0.3-0.2-0.6-0.2-1V1.4c0-0.8,0.3-1.1,1.2-1.1H89c0.4,0,0.7,0,1,0.2
          c0.2,0.2,0.4,0.5,0.4,0.9c0,0.5-0.1,0.8-0.4,0.9c-0.3,0.2-0.5,0.2-1,0.2h-2.4v1.8h1.9c0.4,0,0.7,0,1,0.2c0.2,0.2,0.4,0.4,0.4,0.9
          c0,0.5-0.1,0.8-0.4,0.9c-0.3,0.2-0.5,0.2-1,0.2h-1.9V9.2z M96.9,9.2c0,0.4,0,0.7-0.2,1c-0.2,0.3-0.5,0.4-1.1,0.4
          c-0.5,0-0.9-0.1-1.1-0.4c-0.2-0.3-0.2-0.6-0.2-1V2.5h-1.7c-0.4,0-0.7,0-1-0.2c-0.2-0.2-0.4-0.5-0.4-0.9c0-0.5,0.1-0.8,0.4-0.9
          c0.3-0.2,0.5-0.2,1-0.2h6c0.4,0,0.7,0,1,0.2c0.2,0.2,0.4,0.5,0.4,0.9c0,0.5-0.1,0.8-0.4,0.9c-0.3,0.2-0.5,0.2-1,0.2h-1.7V9.2z'/>
      </svg>
    );
  }
});

var Brews = React.createClass({
  componentDidMount: function () {

  },
  getDefaultProps: function() {
    return {
      notes: []
    };
  },
  render: function () {
    var style = {
      brews: { padding: '15px 0' },
      empty: { padding: '145px 0 0' },
      empty_title: {
        fontSize: Type.large,
        margin: '0 0 30px'
      },
      empty_text: {
        fontSize: Type.medium,
        lineHeight: 1.3,
        margin: '0 0 40px'
      }
    };
    _.extend(style.brews, scrollStyles);
    var app = this.props.app;
    var notes = this.props.notes;
    return (
      <div style={style.brews}>
        {notes.length ? _.map(notes, function (note, index) {
            return (
              <BrewItem
                app={app}
                index={index}
                note={note}
                key={note.brew} />
              );
          }
        ) : (
          <div style={style.empty}>
            <h1 style={style.empty_title}>Which craft beers <br/>have you had?</h1>
            <p style={style.empty_text}>You haven’t added <br/>any brews, yet.</p>
            <Button text='I have one right now.' />
          </div>
        )}
        <AddButton
          onClick={app._openPopover.bind(null, 'add')}
          onTouchStart={app._openPopover.bind(null, 'add')} />
      </div>
    );
  }
});

var BrewItem = React.createClass({
  mixins: [ReactFireMixin],
  getInitialState: function() {
    return {
      brew: {
        name: ''
      },
      brewery: {
        name: '',
        city: ''
      }
    };
  },
  componentDidMount: function () {
    var note = this.props.note;
    if (note) {
      this.bindAsObject(firebase.child('brews').child(note.brew), 'brew');
      this.bindAsObject(firebase.child('breweries').child(note.brewery), 'brewery');
    }
  },
  propTypes: {
    note: React.PropTypes.shape({
      brew: React.PropTypes.string.isRequired,
      brewery: React.PropTypes.string.isRequired,
      text: React.PropTypes.string,
      liked: React.PropTypes.bool
    })
  },
  render: function () {
    var style = {
      brew: {
        padding: '15px 30px',
        textAlign: 'left',
        cursor: 'pointer'
      },
      name: {
        fontSize: 16,
        lineHeight: '20px',
        pointerEvents: 'none'
      },
      brewery: {
        fontSize: 14,
        pointerEvents: 'none'
      },
      city: {
        color: Colors.light
      }
    };
    var brew = this.state.brew;
    var brewery = this.state.brewery;
    var app = this.props.app;
    return (
        <div
          style={style.brew}
          onClick={app._setCurrentNote.bind(null, this.props.index)}>
          <h1 style={style.name}>{brew.name}</h1>
          <p style={style.brewery}>{brewery.name} <span style={style.city}>{brewery.city}</span></p>
        </div>
    );
  }
});

var Menu = React.createClass({
  render: function () {
    var app = this.props.app;
    var style = {
      menu: {
        width: '100%',
        // height: document.documentElement.clientHeight,
        height: '100%',
        background: Colors.white,
        position: 'absolute',
        top: app.state.menuOpen ? 0 : 'calc(-100% + 81px)',
        left: 0,
        transition: 'top .6s cubic-bezier(.1,1,.1,1)',
        transform: 'translateZ(0)'
      },
      button: {
        width: '100%',
        height: 80,
        borderBottom: '1px solid '+ Colors.faint,
        padding: '20px 0 0',
        position: 'absolute',
        bottom: 0,
        left: 0
      },
      logotype: {}
    };
    return (
      <div style={style.menu}>
        <Center column='true'>
          <Button
            onClick={app.openPage.bind(null, 'brews', true)}
            onTouchStart={app.openPage.bind(null, 'brews', true)}
            text='Brews'
            treatment='menu' />
          <Button
            onClick={app.openPage.bind(null, 'breweries', true)}
            onTouchStart={app.openPage.bind(null, 'breweries', true)}
            text='Breweries'
            treatment='menu' />
          <Button
            onClick={app.openPage.bind(null, 'account', true)}
            onTouchStart={app.openPage.bind(null, 'account', true)}
            text='Account'
            treatment='menu' />
          <Button
            onClick={app.openPage.bind(null, 'feedback', true)}
            onTouchStart={app.openPage.bind(null, 'feedback', true)}
            text='Feedback'
            treatment='menu' />
          <Button
            onClick={app.openPage.bind(null, 'status', true)}
            onTouchStart={app.openPage.bind(null, 'status', true)}
            text='Status'
            treatment='menu' />
        </Center>
        <button
          onClick={app._toggleMenu}
          onTouchStart={app._toggleMenu}
          style={style.button}
          type='button'
        >
          <Logotype style={style.logotype} />
        </button>
      </div>
    );
  }
});

var AddButton = React.createClass({
  render: function () {
    var style = {
      button: {
        width: 50,
        height: 50,
        background: Colors.white,
        border: '1px solid '+ Colors.dark,
        borderRadius: 3,
        padding: 12,
        position: 'absolute',
        bottom: 30,
        right: 30
      },
      plus: {
        width: 24,
        height: 24
      }
    };
    return (
      <button
        onClick={this.props.onClick}
        onTouchStart={this.props.onTouchStart}
        style={style.button}
      >
        <svg style={style.plus} viewBox='0 0 100 100'>
          <polygon points='100,41.7 58.3,41.7 58.3,0 41.7,0 41.7,41.7 0,41.7 0,58.3 41.7,58.3 41.7,100 58.3,100 58.3,58.3
  100,58.3'/>
        </svg>
      </button>
    );
  }
});

var BrewForm = React.createClass({
  mixins: [ReactFireMixin],
  getInitialState: function() {
    return {
      brew: '',
      brewery: '',
      validated: false,
      liked: null
    };
  },
  getDefaultProps: function() {
    return {
      note: null
    };
  },
  componentDidUpdate: function(prevProps, prevState) {
    if (prevState.brew.name != this.state.brew.name) {
      this.refs.name.getDOMNode().value = this.state.brew.name;
    }
    if (prevState.brewery.name != this.state.brewery.name) {
      this.refs.brewery.getDOMNode().value = this.state.brewery.name;
    }
  },
  componentDidMount: function() {
    var note = this.props.note;
    this._validate();
    if (note) {
      this.bindAsObject(firebase.child('brews').child(note.brew), 'brew');
      this.bindAsObject(firebase.child('breweries').child(note.brewery), 'brewery');
      if (typeof note.liked != 'undefined') this.setState({liked: note.liked});
    }
  },
  createBrewery: function(name) {
    var self = this;
    // Add Brewery
    var breweryRef = firebase.child('breweries').push();
    var breweryId = breweryRef.key();
    firebase.child('breweries').child(breweryId).set({
      // city: city,
      name: name
    });
    return breweryId;
  },
  addBrewToBrewery: function(breweryId, brewId) {
    firebase.child('breweries').child(breweryId).child('brews').child(brewId).set(true);
  },
  addBreweryToUser: function(breweryId) {
    firebase.child('users').child(this.props.user).child('breweries').child(breweryId).set(true);
    firebase.child('breweries').child(breweryId).child('users').child(this.props.user).set(true);
  },
  addBrewToUser: function(brewId) {
    firebase.child('users').child(this.props.user).child('brews').child(brewId).set(true);
    firebase.child('brews').child(brewId).child('users').child(this.props.user).set(true);
  },
  createNote: function(e) {
    e.preventDefault();
    var self = this;
    var name = this.refs.name.getDOMNode().value;
    var brewery = this.refs.brewery.getDOMNode().value;
    var text = this.refs.text.getDOMNode().value;
    var liked = this.state.liked;

    // TODO: Provide some basic validation before closing popover
    this.props.app._closePopover(e);

    // Create brewery
    // TODO: Check if the brewery already exists in Firebase
    var breweryId = this.createBrewery(brewery);

    // Create brew
    // TODO: Check if the brew already exists in Firebase
    var brewRef = firebase.child('brews').push();
    var brewId = brewRef.key();
    firebase.child('brews').child(brewId).set({
      name: name,
      brewery: breweryId,
    });

    // Get some brew + brewery data from BreweryDB
    // TODO: Make sure we match the correct brew
    // TODO: Provide some error handling, since this is somewhat fragile
    $.ajax({
      url:"https://www.kimonolabs.com/api/ondemand/cmagu84i?apikey=EgIYTM8HavTvDWxbAro1VOHSEB4fsRAP&kimmodify=1",
      crossDomain: true,
      dataType: "jsonp",
      data: {
        q: name + " " + brewery
      },
      success: function (data) {
        // Yucky hardcoded bullshit
        if (data['data']) data = data['data'][0];
        if (data) {
          firebase.child('brews').child(brewId).update({
            abv: data['abv'] ? data['abv'] : '',
            style: data['style'] ? data['style']['name'] : ''
          });
        }
      },
      error: function (xhr, status) {
        console.log(status);
      }
    });

    var noteRef = firebase.child('users').child(this.props.user).child('notes').push();
    var noteId = noteRef.key();
    firebase.child('users').child(this.props.user).child('notes').child(noteId).set({
      brew: brewId,
      brewery: breweryId,
      text: text
    });

    if (liked != null) {
      firebase.child('users').child(this.props.user).child('notes').child(noteId).update({
        liked: liked
      });
    }

    // Add brew to brewery and both to current user
    this.addBrewToBrewery(breweryId, brewId);
    this.addBrewToUser(brewId);
    this.addBreweryToUser(breweryId);
  },
  updateNote: function(e) {
    e.preventDefault();
    var self = this;
    var name = this.refs.name.getDOMNode().value;
    var brewery = this.refs.brewery.getDOMNode().value;
    var text = this.refs.text.getDOMNode().value;
    var liked = this.state.liked;

    this.props.app._closePopover(e);

    firebase.child('brews').child(this.props.note.brew).update({
      name: name
    });

    firebase.child('breweries').child(this.props.note.brewery).update({
      name: brewery
    });

    $.ajax({
      url:"https://www.kimonolabs.com/api/ondemand/cmagu84i?apikey=EgIYTM8HavTvDWxbAro1VOHSEB4fsRAP&kimmodify=1",
      crossDomain: true,
      dataType: "jsonp",
      data: {
        q: name + " " + brewery
      },
      success: function (data) {
        // Yucky hardcoded bullshit
        if (data['data']) data = data['data'][0];
        if (data) {
          firebase.child('brews').child(self.props.note.brew).update({
            abv: data['abv'] ? data['abv'] : '',
            style: data['style'] ? data['style']['name'] : ''
          });
        }
      },
      error: function (xhr, status) {
        console.log(status);
      }
    });

    firebase.child('users').child(this.props.user).child('notes').child(this.props.noteId).update({
      text: text
    });

    if (liked != null) {
      firebase.child('users').child(this.props.user).child('notes').child(this.props.noteId).update({
        liked: liked
      });
    }
  },
  _validate: function () {
    var name = this.refs.name.getDOMNode().value;
    var brewery = this.refs.brewery.getDOMNode().value;
    if (name && brewery) {
      this.setState({validated: true});
    } else {
      this.setState({validated: false});
    }
    this.setState({error: false});
  },
  _yep: function () {
    if (this.state.liked) this.setState({liked: null});
    else this.setState({liked: true});
  },
  _nope: function () {
    var liked = this.state.liked;
    if (liked !== null && !liked) this.setState({liked: null});
    else this.setState({liked: false});
  },
  render: function () {
    var liked = this.state.liked;
    var isNotLiked = liked !== null && !liked;
    var style = {
      form: { padding: 30 },
      logomark: {
        width: 40,
        height: 40,
        display: 'block',
        margin: '0 auto 10px'
      },
      title: {
        fontSize: Type.large,
        margin: '0 0 10px'
      },
      notes: { height: 100 },
      rating: {
        margin: '0 0 20px',
        whiteSpace: 'nowrap'
      },
      rating_text: {
        fontWeight: 600,
        margin: '0 15px 0 0'
      },
      yep: {
        background: liked ? Colors.dark : null,
        border: '1px solid '+ Colors.dark,
        borderTopLeftRadius: 4,
        borderBottomLeftRadius: 4,
        color: liked ? Colors.white : null,
        fontWeight: 600,
        padding: '5px 10px'
      },
      nope: {
        background: isNotLiked ? Colors.dark : null,
        borderColor: Colors.dark,
        borderStyle: 'solid',
        borderWidth: '1px 1px 1px 0',
        borderTopRightRadius: 4,
        borderBottomRightRadius: 4,
        color: isNotLiked ? Colors.white : null,
        fontWeight: 600,
        padding: '5px 10px'
      },
      save: {
        width: '100%',
        margin: '0 0 10px'
      }
    };
    var app = this.props.app;
    return (
      <form style={style.form} onSubmit={this.props.note ? this.updateNote : this.createNote}>
        <Logomark style={style.logomark} />
        <h1 style={style.title}>{this.props.note ? 'Edit brew' : 'Add brew'}</h1>
        <Label htmlFor='brewName' text='Brew name' />
        <Input
          id='brewName'
          onChange={this._validate}
          placeholder='Zombie Dust'
          defaultValue={this.state.brew.name}
          ref='name' />
        <Label htmlFor='breweryName' text='Brewery name' />
        <Input
          id='breweryName'
          onChange={this._validate}
          placeholder='3 Floyds Brewing Co.'
          defaultValue={this.state.brewery.name}
          ref='brewery' />
        <Label htmlFor='notes' text='Notes' />
        <Textarea
          id='notes'
          ref='text'
          placeholder='Optional'
          style={style.notes}
          defaultValue={this.props.note ? this.props.note.text : ''} />
        <p style={style.rating}>
          <span style={style.rating_text}>Would drink again?</span>
          <button
            onClick={this._yep}
            style={style.yep}
            type="button">Yep</button>
          <button
            onClick={this._nope}
            style={style.nope}
            type="button">Nope</button>
        </p>
        <Button
          disabled={!this.state.validated}
          style={style.save}
          type='submit'
          text='Save brew' />
        <Button
          onClick={app._closePopover}
          onTouchStart={app._closePopover}
          text='Cancel'
          treatment='cancel' />
      </form>
    );
  }
});

var Brew = React.createClass({
  mixins: [ReactFireMixin],
  getInitialState: function() {
    return {
      abv: '',
      brew: {
        name: ''
      },
      brewery: {
        name: '',
        city: ''
      }
    };
  },
  componentDidMount: function () {
    var self = this;
    var note = this.props.note;
    if (note) {
      this.bindAsObject(firebase.child('brews').child(note.brew), 'brew');
      this.bindAsObject(firebase.child('breweries').child(note.brewery), 'brewery');
    }
  },
  propTypes: {
    note: React.PropTypes.shape({
      brew: React.PropTypes.string.isRequired,
      brewery: React.PropTypes.string.isRequired,
      text: React.PropTypes.string,
      liked: React.PropTypes.bool
    })
  },
  render: function () {
    var style = {
      wrap: {
        padding: '50px 50px 0'
      },
      logomark: {
        width: 40,
        height: 40,
        display: 'block',
        margin: '0 auto 40px'
      },
      name: {
        fontSize: 30,
        fontWeight: 400,
        margin: '0 0 15px'
      },
      brewery: {
        color: Colors.light,
        fontSize: Type.medium,
        fontWeight: 600
      },
      city: {
        color: Colors.light,
        lineHeight: '20px',
        margin: '0 0 15px'
      },
      other: { margin: '0 0 20px' },
      style: { margin: '0 20px 0 0' },
      abv: { fontSize: Type.small },
      rule: {
        width: 40,
        height: 1,
        background: Colors.dark,
        border: 'initial',
        margin: '30px auto'
      },
      notes: {
        lineHeight: '20px',
        margin: '0 0 20px'
      },
      rating: { margin: '0 0 20px' }
    };
    var brew = this.state.brew;
    var brewery = this.state.brewery;
    var note = this.props.note;
    var app = this.props.app;
    return (
      <div style={style.wrap}>
        <Logomark style={style.logomark} />
        <h1 style={style.name}>{brew.name}</h1>
        <p style={style.brewery}>{brewery.name}</p>
        <p style={style.city}>{brewery.city}</p>
        <p style={style.other}>
          <span style={style.style}>{brew.style}</span>
          {brew.abv && <span>{brew.abv}% <span style={style.abv}>ABV</span></span>}
        </p>
        <hr style={style.rule} />
        <p style={style.notes}>{note.text}</p>
        {typeof note.liked != 'undefined' && <Rating liked={note.liked} style={style.rating} />}
        <Button
          text='Edit'
          treatment='tiny'
          onClick={app._openPopover.bind(null, 'edit')} />
        <Button
          onClick={app._closePopover}
          onTouchStart={app._closePopover}
          text='Back to brews'
          treatment='cancel' />
      </div>
    );
  }
});

var Rating = React.createClass({
  render: function () {
    var style = {
      icon: {
        width: 20,
        height: 20,
        margin: '0 5px 0 0',
        verticalAlign: 'middle'
      },
      text: {
        fontSize: Type.small,
        fontWeight: 600,
        letterSpacing: '.05em',
        textTransform: 'uppercase'
      }
    };
    var liked = this.props.liked;
    if (!liked) style.icon.transform = style.icon.WebkitTransform = 'rotate(180deg)';
    var icon = <svg style={style.icon} viewBox='0 0 92.3 100'><path d='M89.4,55.9c0.4,1.3,0.5,2.8,0.5,4.1c0,3-0.8,6-2.3,8.7c0.1,0.8,0.2,1.7,0.2,2.6c0,3.8-1.3,7.7-3.6,10.7c0.1,11.4-7.6,18-18.7,18h-2.2h-5.6c-8.5,0-16.5-2.5-24.4-5.3c-1.7-0.6-6.6-2.4-8.3-2.4H7.7c-4.3,0-7.7-3.4-7.7-7.7V46.2c0-4.3,3.4-7.7,7.7-7.7h16.5c2.3-1.6,6.4-7,8.2-9.3c2-2.6,4.1-5.2,6.4-7.7c3.6-3.8,1.7-13.3,7.7-19.2C48,0.8,49.9,0,51.9,0c6.3,0,12.3,2.2,15.2,8.1c1.9,3.7,2.1,7.2,2.1,11.2c0,4.2-1.1,7.8-2.9,11.5h10.6c8.3,0,15.4,7,15.4,15.3C92.3,49.6,91.3,53,89.4,55.9z M11.5,76.9c-2.1,0-3.8,1.7-3.8,3.8s1.7,3.8,3.8,3.8s3.8-1.7,3.8-3.8S13.6,76.9,11.5,76.9z M76.9,38.5H55.8c0-7,5.8-12.1,5.8-19.2c0-7-1.4-11.5-9.6-11.5c-3.8,3.9-1.9,13.1-7.7,19.2c-1.7,1.7-3.1,3.6-4.6,5.5c-2.7,3.5-9.9,13.8-14.6,13.8h-1.9v38.5H25c3.4,0,8.9,2.2,12.1,3.3c6.6,2.3,13.5,4.4,20.6,4.4H65c6.8,0,11.5-2.7,11.5-10c0-1.1-0.1-2.3-0.3-3.4c2.5-1.4,3.9-4.8,3.9-7.6c0-1.4-0.4-2.9-1.1-4.1c2-1.9,3.2-4.3,3.2-7.2c0-1.9-0.8-4.7-2.1-6.2c2.8-0.1,4.5-5.5,4.5-7.7C84.6,42.1,81,38.5,76.9,38.5z'/></svg>
    return liked ? (
      <p style={this.props.style}>{icon} <span style={style.text}>Would drink again</span></p>
    ) : (
      <p style={this.props.style}>{icon} <span style={style.text}>Would not drink again</span></p>
    );
  }
});

var Confirm = React.createClass({
  render: function () {
    var style = {};
    return (
      <div style={style}>
        <Center>
          Are you sure you want to cancel?
          <Button text='Yep' />
          <Button text='Nope' treatment='tiny' />
        </Center>
      </div>
    );
  }
});

var Breweries = React.createClass({
  render: function () {
    var style = {
      breweries: {}
    };
    _.extend(style.breweries, maxLandscape);
    return (
      <Center>
        <div style={style.breweries}>
          Breweries
        </div>
      </Center>
    );
  }
});

var Feedback = React.createClass({
  render: function () {
    var style = {
      feedback: {}
    };
    _.extend(style.feedback, maxLandscape);
    return (
      <Center>
        <div style={style.feedback}>
          Feedback
        </div>
      </Center>
    );
  }
});

var Account = React.createClass({
  _logout: function () {
    this.props.app.setState({page: 'brews'});
    firebase.unauth();
  },
  render: function () {
    var style = {
      account: { padding: 30 },
      image: {
        width: 100,
        height: 100,
        borderRadius: '50%',
        margin: '0 0 20px'
      },
      name: {
        fontSize: Type.large,
        margin: '0 0 5px'
      },
      email: {
        fontSize: Type.medium,
        margin: '0 0 5px'
      },
      since: {
        color: Colors.light,
        margin: '0 0 30px'
      },
      metrics: { margin: '0 0 40px' },
      brews: {
        width: 'calc(50% - 30px)',
        float: 'left',
        textAlign: 'right'
      },
      metric: {
        display: 'block',
        fontFamily: 'proxima-nova, sans-serif',
        fontSize: 60
      },
      label: {
        letterSpacing: '.1em',
        textTransform: 'uppercase'
      },
      from: {
        width: 60,
        color: Colors.light,
        float: 'left',
        padding: '30px 0 0'
      },
      breweries: {
        width: 'calc(50% - 30px)',
        float: 'left',
        textAlign: 'left'
      },
      upgrade: { margin: '0 0 20px' },
      signout: {}
    };
    _.extend(style.account, scrollStyles);
    var app = this.props.app;
    var user = this.props.user;
    return (
      <div style={style.account}>
        <img src={'http://gravatar.com/avatar/'+ user.gravatar +'?s=200'} style={style.image} />
        <h1 style={style.name}>{user.name}</h1>
        <p style={style.email}>{user.email}</p>
        <p style={style.since}>Since {moment(user.joined).format('MMMM YYYY')}</p>
        <div style={style.metrics}>
          <div style={style.brews}>
            <span style={style.metric}>{Object.keys(user.notes).length}</span>
            <span style={style.label}>brews</span>
          </div>
          <div style={style.from}>from</div>
          <div style={style.breweries}>
            <span style={style.metric}>{'--' || Object.keys(user.breweries).length}</span>
            <span style={style.label}>breweries</span>
          </div>
          <div style={{clear:'both'}} />
        </div>
        <Button
          onClick={app.openPage.bind(null, 'upgrade', false)}
          onTouchStart={app.openPage.bind(null, 'upgrade', false)}
          style={style.upgrade}
          text='Upgrade to PRO'
          treatment='primary' />
        <Button
          onClick={this._logout}
          onTouchStart={this._logout}
          style={style.signout}
          text='Sign out'
          treatment='cancel' />
      </div>
    );
  }
});

var Upgrade = React.createClass({
  _flagAccount: function () {
    console.log('TODO: add upgrade flag to database for this account');
  },
  render: function () {
    var style = {
      upgrade: { padding: 50 },
      title: {
        fontSize: Type.large,
        margin: '0 0 5px'
      },
      price: {
        fontSize: Type.large,
        margin: '0 0 20px'
      },
      text: {
        lineHeight: 1.3,
        margin: '0 0 30px'
      },
      primary: { margin: '0 0 20px' }
    };
    _.extend(style.upgrade, maxLandscape);
    var app = this.props.app;
    return (
      <div style={style.upgrade}>
        <h1 style={style.title}>PRO</h1>
        <p style={style.price}>$50 / year</p>
        <p style={style.text}>For now, WhichCraft is a beer-centric, glorified notepad. We want to keep the base app simple, but we know some users will want to do more. Before we dive in, we’re gauging how many of you want us to invest more time into building more features. Click below if this sounds like something you want.</p>
      <Button
        onClick={this._flagAccount}
        onTouchStart={this._flagAccount}
        style={style.primary}
        text='Yeah, I’m interested'
        treatment='primary' />
      <Button
        onClick={app.openPage.bind(null, 'account', false)}
        onTouchStart={app.openPage.bind(null, 'account', false)}
        text='Nevermind'
        treatment='cancel' />
      </div>
    );
  }
});

var Status = React.createClass({
  getInitialState: function() {
    return {
      online: false,
      unique_brews: null,
      unique_breweries: null,
      total_users: null
    };
  },
  componentWillMount: function() {
    var self = this;
    firebase.once('value', function(snapshot) {
      // TODO: replace total_brews with recursive count of each users’ brews
      self.setState({
        online: true,
        unique_brews: snapshot.child('brews').numChildren(),
        unique_breweries: snapshot.child('breweries').numChildren(),
        total_brews: snapshot.child('brews').numChildren(),
        total_users: snapshot.child('users').numChildren()
      });
    });
  },
  render: function () {
    var style = {
      status: { padding: '30px 0' },
      title: {
        fontSize: Type.large,
        margin: '0 0 20px'
      },
      server: {
        border: '1px solid '+ Colors.dark,
        display: 'inline-block',
        fontSize: Type.medium,
        lineHeight: '38px',
        padding: '0 20px'
      },
      quadrant: {
        width: '50%',
        borderColor: Colors.dark,
        borderStyle: 'solid',
        float: 'left',
        padding: '25px 0'
      },
      first: { borderWidth: '0 1px 1px 0' },
      second: { borderWidth: '0 0 1px 0' },
      third: { borderWidth: '0 1px 0 0' },
      fourth: { borderWidth: 0 },
      metric: {
        font: '36px proxima-nova, sans-serif',
        margin: '10px 0 0'
      },
      label: {
        letterSpacing: '.1em',
        textTransform: 'uppercase'
      },
      from: {
        color: Colors.light,
        fontSize: Type.small,
        margin: '15px 0 0'
      },
      heading: { fontSize: Type.medium }
    };
    _.extend(style.status, maxLandscape, scrollStyles);
    return (
      <div style={style.status}>
        <h1 style={style.title}>Status</h1>
        <span style={style.server}>Server is {this.state.online ? 'ONLINE' : <span style={style.offline}>OFFLINE</span>}</span>
        <div>
          <div style={_.extend(style.first, style.quadrant)}>
            <p style={style.metric}>{this.state.unique_brews}</p>
            <p style={style.label}>Brews</p>
            <p style={style.from}>from</p>
            <p style={style.metric}>{this.state.unique_breweries}</p>
            <p style={style.label}>Breweries</p>
          </div>
          <div style={_.extend(style.second, style.quadrant)}>
            <p style={style.metric}>{this.state.total_brews}</p>
            <p style={style.label}>Total Brews</p>
            <p style={style.from}>from</p>
            <p style={style.metric}>{this.state.total_users}</p>
            <p style={style.label}>Users</p>
          </div>
          <div style={_.extend(style.third, style.quadrant)}>
            <p style={style.heading}>Active Users</p>
            <p style={style.metric}>--</p>
            <p style={style.label}>Past Day</p>
            <p style={style.metric}>--</p>
            <p style={style.label}>Past Week</p>
          </div>
          <div style={_.extend(style.fourth, style.quadrant)}>
            <p style={style.heading}>Brews Added</p>
            <p style={style.metric}>--</p>
            <p style={style.label}>Past Day</p>
            <p style={style.metric}>{this.state.total_users}</p>
            <p style={style.label}>Past Week</p>
          </div>
          <div style={{clear:'both'}} />
        </div>
      </div>
    );
  }
});

var Alert = React.createClass({
  render: function () {
    var treatment = this.props.treatment || Colors.dark;
    var treatments = {
      error: Colors.error
    };
    var color = treatment ? treatments[treatment] : Colors.dark
    var style = {
      border: '1px solid '+ color,
      borderRadius: 2,
      color: color,
      lineHeight: '18px',
      padding: '6px 10px'
    };
    return <p style={_.extend(style, this.props.style)}>{this.props.text}</p>;
  }
});

var Button = React.createClass({
  render: function () {
    var disabled = this.props.disabled;
    var treatment = this.props.treatment || 'primary';
    var style = {
      lineHeight: '18px',
      padding: '11px 20px'
    };
    var tiny = {
        width: '100%',
        fontSize: Type.small,
        fontWeight: 600,
        letterSpacing: '.1em',
        padding: '13px',
        textTransform: 'uppercase'
    };
    var treatments = {
      cancel: _.extend(_.clone(tiny), {color: Colors.light}),
      menu: {
        width: '100%',
        fontSize: Type.large,
        letterSpacing: '.1em',
        lineHeight: '30px',
        textTransform: 'uppercase'
      },
      primary: {
        background: Colors.dark,
        borderRadius: 3,
        color: Colors.white,
        fontSize: Type.medium
      },
      submit: {
        width: '100%',
        background: Colors.dark,
        borderRadius: 3,
        color: Colors.white,
        fontSize: Type.normal,
        fontWeight: 600,
        letterSpacing: '.1em',
        padding: '14px',
        textTransform: 'uppercase'
      },
      tiny: _.extend(tiny, {color: Colors.dark})
    };
    if (treatment) { _.extend(style, treatments[treatment]); }
    if (disabled) { _.extend(style, {background: Colors.light}); }
    var type = this.props.type || 'button';
    return (
      <button
        disabled={disabled}
        onClick={this.props.onClick}
        onTouchStart={this.props.onTouchStart}
        style={_.extend(style, this.props.style)}
        type={type}
      >
        <span className='button-text'>{this.props.text}</span>
      </button>
    );
  }
});

var Link = React.createClass({
  render: function () {
    var style = {
      color: Colors.light,
      textDecoration: 'underline',
      textTransform: 'lowercase'
    };
    return (
      <button
        style={_.extend(style, this.props.style)}
        type='button'
      >
        <span className='button-text'>{this.props.text}</span>
      </button>
    );
  }
});

var Label = React.createClass({
  render: function () {
    var style = {
      display: 'block',
      fontWeight: 600,
      margin: '0 0 5px',
      textAlign: 'left'
    };
    return <label
      htmlFor={this.props.htmlFor}
      style={_.extend(style, this.props.style)}
    >
      {this.props.text}
    </label>;
  }
});

var Input = React.createClass({
  _focus: function (e) {
    e.currentTarget.style.borderColor = Colors.dark;
  },
  _blur: function (e) {
    e.currentTarget.style.borderColor = Colors.light;
  },
  render: function () {
    var style = {
      width: '100%',
      fontSize: Type.medium,
      margin: '0 0 20px'
    };
    var treatments = {
      default: {
        border: '1px solid '+ Colors.light,
        padding: 10
      },
      thin: {
        borderBottom: '1px solid '+ Colors.light,
        padding: '10px 0'
      }
    };
    var treatment = this.props.treatment || 'default';
    _.extend(style, treatments[treatment]);
    return <input
      id={this.props.id}
      onChange={this.props.onChange}
      onFocus={this._focus}
      onBlur={this._blur}
      defaultValue={this.props.defaultValue}
      placeholder={this.props.placeholder}
      style={_.extend(style, this.props.style)}
      type={this.props.type} />;
  }
});

var Textarea = React.createClass({
  _focus: function (e) {
    e.currentTarget.style.borderColor = Colors.dark;
  },
  _blur: function (e) {
    e.currentTarget.style.borderColor = Colors.light;
  },
  render: function () {
    var style = {
      width: '100%',
      border: '1px solid '+ Colors.light,
      fontSize: Type.medium,
      margin: '0 0 20px',
      padding: 10
    };
    return <textarea
      id={this.props.id}
      onFocus={this._focus}
      onBlur={this._blur}
      defaultValue={this.props.defaultValue}
      placeholder={this.props.placeholder}
      style={_.extend(style, this.props.style)} />;
  }
});

React.render(<App />, document.body);