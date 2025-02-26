import { lazy } from 'react';
import { Navigate } from 'react-router-dom';
import Loadable from './shared/loadable/Loadable';

/* ****Pages***** */
const HangmanGame = Loadable(lazy(() => import('../view/HangmanGame')));

const Router = [
  {
    path: '/',
    children: [
      { path: '/', element: <Navigate to="/hangmanGame" /> },
      { path: '/hangmanGame', exact: true, element: <HangmanGame /> },
      { path: '*', element: <Navigate to="/hangmanGame" /> },
    ],
  },
];

export default Router;
