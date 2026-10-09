import { describe, expect, it } from "vitest";
import { site } from "@/data/site";
import { getLocation, primaryWhatsAppLine } from "@/lib/locations";
import {
  buildDoctorContact,
  buildMailtoLink,
  doctorContact,
  buildWhatsAppLink,
  clinicWhatsApp,
  locationWhatsApp,
  messageAbout,
  messageForDoctor,
  withLocation,
} from "@/lib/whatsapp";

describe("buildWhatsAppLink", () => {
  it("encodes the message and strips non-digits from the number", () => {
    const link = buildWhatsAppLink("+51 994 931 540", "Hola & gracias");
    expect(link).toBe("https://wa.me/51994931540?text=Hola%20%26%20gracias");
  });
});

describe("clinicWhatsApp", () => {
  it("uses the primary official line", () => {
    expect(clinicWhatsApp("Hola")).toBe(`https://wa.me/${primaryWhatsAppLine().number}?text=Hola`);
  });
});

describe("withLocation y locationWhatsApp", () => {
  it("adds the branch to a prefilled message", () => {
    expect(withLocation("Hola SERMEKARE, quisiera agendar una densitometría ósea.", getLocation("los-olivos"))).toBe(
      "Hola SERMEKARE, quisiera agendar una densitometría ósea en la sede de Los Olivos.",
    );
  });

  it("opens the WhatsApp of that branch", () => {
    const location = getLocation("puente-piedra");
    expect(locationWhatsApp(location, "Hola")).toBe(`https://wa.me/${location.whatsapp.number}?text=Hola`);
  });
});

describe("messageAbout", () => {
  it("adapts the base message to a topic and optional doctor", () => {
    expect(messageAbout("Gota")).toBe("Hola SERMEKARE, quiero agendar una teleconsulta por gota.");
    expect(messageAbout("Rodillas", "Dra. Ana")).toBe(
      "Hola SERMEKARE, quiero agendar una teleconsulta con Dra. Ana por rodillas.",
    );
  });
});

describe("messageForDoctor", () => {
  it("asks for an appointment with a specific doctor", () => {
    expect(messageForDoctor("Dr. Luis Prado")).toBe(
      "Hola SERMEKARE, quiero agendar una teleconsulta con Dr. Luis Prado.",
    );
  });
});

describe("buildDoctorContact", () => {
  const line = { label: "Doctor", display: "+51 994 931 540", number: "51994931540" };

  it("builds the WhatsApp link with the encoded doctor message and a tel: link", () => {
    const contact = buildDoctorContact(line);
    expect(contact?.whatsappHref).toBe(
      "https://wa.me/51994931540?text=Hola%20Doctor%2C%20deseo%20m%C3%A1s%20informaci%C3%B3n%20para%20una%20teleconsulta%20m%C3%A9dica",
    );
    expect(contact?.telHref).toBe("tel:+51994931540");
    expect(contact?.display).toBe("+51 994 931 540");
  });

  it("returns null without a line or with an invalid number (never broken links)", () => {
    expect(buildDoctorContact(null)).toBeNull();
    expect(buildDoctorContact({ ...line, number: "" })).toBeNull();
    expect(buildDoctorContact({ ...line, number: "123" })).toBeNull();
    expect(buildDoctorContact({ ...line, number: "0051994931540" })).toBeNull();
  });

  it("uses the centralized doctor line of data/site.ts", () => {
    expect(doctorContact()?.telHref).toBe(site.doctorLine ? `tel:+${site.doctorLine.number}` : undefined);
  });
});

describe("buildMailtoLink", () => {
  it("builds an encoded mailto link", () => {
    expect(buildMailtoLink("a@b.com", "Cita", "Hola mundo")).toBe(
      "mailto:a@b.com?subject=Cita&body=Hola%20mundo",
    );
  });
});
