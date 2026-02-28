"use client";

import { Box, Container, Typography, Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import { useTranslations } from "next-intl";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

export default function FAQSection() {
  const t = useTranslations("landing.faq");

  const faqs = [
    {
      question: t("q1.question"),
      answer: t("q1.answer"),
    },
    {
      question: t("q2.question"),
      answer: t("q2.answer"),
    },
    {
      question: t("q3.question"),
      answer: t("q3.answer"),
    },
    {
      question: t("q4.question"),
      answer: t("q4.answer"),
    },
    {
      question: t("q5.question"),
      answer: t("q5.answer"),
    },
  ];

  return (
    <Box
      sx={{
        py: { xs: 8, md: 12 },
        bgcolor: "#f9fafb",
      }}
    >
      <Container maxWidth="md">
        <Box sx={{ textAlign: "center", mb: 8 }}>
          <Typography
            variant="h3"
            fontWeight="bold"
            mb={2}
            sx={{ fontSize: { xs: "2rem", md: "2.5rem" } }}
          >
            {t("title")}
          </Typography>
          <Typography variant="h6" color="text.secondary">
            {t("subtitle")}
          </Typography>
        </Box>

        <Box>
          {faqs.map((faq, index) => (
            <Accordion
              key={index}
              elevation={0}
              sx={{
                mb: 2,
                border: 1,
                borderColor: "divider",
                borderRadius: 2,
                "&:before": {
                  display: "none",
                },
                "&.Mui-expanded": {
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                },
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                sx={{
                  py: 2,
                  "& .MuiAccordionSummary-content": {
                    my: 1,
                  },
                }}
              >
                <Typography variant="h6" fontWeight="600">
                  {faq.question}
                </Typography>
              </AccordionSummary>
              <AccordionDetails sx={{ pt: 0, pb: 3 }}>
                <Typography variant="body1" color="text.secondary" lineHeight={1.8}>
                  {faq.answer}
                </Typography>
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>
      </Container>
    </Box>
  );
}
