import send from "../../assets/img/send.svg";
import thumbsUp from "../../assets/img/thumbs-up.svg";
import userCheck from "../../assets/img/user-check.svg";
import "./OurStory.css";

const OurStory = () => {
  return (
    <div
      style={{
        marginBottom: "5%",
        backgroundColor: "#F1F4FF",
        paddingTop: "100px",
        paddingBottom: "44px",
      }}
    >
      <div className="container">
        <article style={styles.article}>
          <small style={styles.small}>Our Story</small>
          <h4 style={styles.title}>BigFix Technologies</h4>
          <p style={styles.desc}>
            Bigfix empowers companies to streamline operations and achieve
            growth through innovative ERP software and digital transformation
            services. Unlock your business&apos;s potential with Bigfix.
          </p>
        </article>
        <div className="cards" style={{ margin: "0" }}>
          {/* card one */}
          <div className="card white-card" style={styles.card}>
            <img src={userCheck} alt="icon checked" className="card-icon" />
            <h4 className="card-title">Expert Guidance</h4>
            <p className="card-desc">
              Leverage the wisdom of industry leaders. Our team of seasoned
              experts is here to guide you through every decision.
            </p>
          </div>

          {/* card two */}
          <div className="card dark-blue-card">
            <img src={send} alt="icon checked" className="card-icon" />
            <h4 className="card-title">Tailored Solutions</h4>
            <p className="card-desc">
              One size doesn’t fit all. That’s why we offer customized solutions
              that are specifically designed to meet your unique needs and
              challenges.
            </p>
          </div>

          {/* card three */}
          <div className="card white-card" style={styles.card}>
            <img src={thumbsUp} alt="thumbs up" className="card-icon" />
            <h4 className="card-title">Streamlined Process</h4>
            <p className="card-desc">
              Our streamlined processes are designed to save you time and
              resources, ensuring that every step is clear, quick, and
              effective.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OurStory;

// inline styles for Article section and its contents
const styles = {
  article: {
    textAlign: "center",
    maxWidth: "650px",
    marginInline: "auto",
    display: "flex",
    flexDirection: "column",
    gap: "13px",
  },
  small: {
    color: "#E37016",
    fontSize: "15px",
    fontWeight: "900",
    // lineHeight: "15px",
    textTransform: "uppercase",
  },
  title: {
    fontSize: "32px",
    color: "#0a2f5a",
    fontWeight: "700",
    lineHeight: "38.4px",
    marginBottom: "20px",
  },
  desc: {
    color: "#0D132E",
    fontSize: "16px",
    fontWeight: "400",
    lineHeight: "25.6px",
  },
  card: {
    BiBorderRadius: "0",
    border: "0",
    background: "transparent",
  },
};
