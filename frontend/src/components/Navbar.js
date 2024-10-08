import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav>
      <ul>
        <li>
        </li>
        <li>
          <Link to="/register">Registrar Usuario</Link>
        </li>
        <li>
          <Link to="/login">Iniciar Sesión</Link>
        </li>
        <li>
          <Link to="/product">Ver Productos</Link>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
