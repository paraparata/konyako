import React from 'react';
import ReactDOM from 'react-dom/client';
import './style.css';

import Timeline from './views/Timeline';
// import FeedById from './views/FeedById';
// import Topic from './views/Topic';
// import Settings from './views/Settings';

import { Redirect, Route, Switch } from 'wouter';
import Layout from '@components/Layout';

const App = () => (
  <Layout>
    <Switch>
      <Route path='/' component={Timeline} />
      {/* <Route
        path='/feeds/:id'
        component={({ params }) =>
          params.id ? <FeedById id={params.id} /> : <Redirect to='/404' />
        }
      /> */}
      {/* <Route path='/topic' component={Topic} />
      <Route path='/settings' component={Settings} /> */}
      <Route>404, Not Found!</Route>
    </Switch>
  </Layout>
);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
