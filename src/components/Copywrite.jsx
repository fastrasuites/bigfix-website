import { Container } from "react-bootstrap";
import BackToTopButton from "./BackToTop";

function Copywrite() {
  return (
    <>
      <div className="copywrite">
        <Container
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <p
            style={{
              fontSize: "16px",
              color: "#fff",
              paddingTop: "20px",
              fontWeight: "300",
            }}
          >
            © Copyright Bigfix Integrated Technologies. All Rights Reserved
          </p>
          <BackToTopButton />
        </Container>
      </div>
    </>
  );
}

export default Copywrite;
