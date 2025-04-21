import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';

const Home = () => {
  return (
    <Container className="vh-100 d-flex justify-content-center align-items-center bg-light">
      <Row>
        <Col>
          <Card className="text-center shadow-lg border-0 rounded-4 p-4">
            <Card.Body>
              <Card.Title as="h1" className="text-primary display-4">
                Bienvenido a nuestro sistema
              </Card.Title>
              <Card.Text className="mt-3 fs-5 text-muted">
                Gestiona tus productos y usuarios desde esta plataforma.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Home;
