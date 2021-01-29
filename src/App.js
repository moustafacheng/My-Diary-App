import "./App.css";
import Diary from "./Components/Diary";
import SignInSignUp from "./Components/SignInSignUp";
import PrivateRoute from "./Components/PrivateRoute";
import { AuthProvider } from "./Contexts/AuthContext";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

function App() {
  return (
    <Router>
      <AuthProvider>
        <Switch>
          <PrivateRoute exact path="/" component={Diary} />
          <Route path="/login" component={SignInSignUp} />
        </Switch>
      </AuthProvider>
    </Router>
  );
}

export default App;
