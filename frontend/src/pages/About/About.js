import React from 'react';
import styled from 'styled-components';
import { FiUsers, FiTarget, FiHeart, FiCode, FiZap, FiShield } from 'react-icons/fi';

const AboutContainer = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: ${props => props.theme.spacing.lg};
`;

const AboutHeader = styled.div`
  text-align: center;
  margin-bottom: ${props => props.theme.spacing['3xl']};
  padding: ${props => props.theme.spacing['2xl']};
  background: linear-gradient(135deg, ${props => props.theme.colors.primary}15, ${props => props.theme.colors.secondary}15);
  border-radius: ${props => props.theme.borderRadius.xl};
  box-shadow: ${props => props.theme.shadows.lg};
`;

const AboutTitle = styled.h1`
  font-size: ${props => props.theme.typography.fontSize['4xl']};
  font-weight: ${props => props.theme.typography.fontWeight.bold};
  color: ${props => props.theme.colors.text};
  margin: 0 0 ${props => props.theme.spacing.lg} 0;
  background: linear-gradient(135deg, ${props => props.theme.colors.primary}, ${props => props.theme.colors.secondary});
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const AboutSubtitle = styled.p`
  font-size: ${props => props.theme.typography.fontSize.xl};
  color: ${props => props.theme.colors.textSecondary};
  margin: 0;
  line-height: 1.6;
`;

const AboutContent = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${props => props.theme.spacing.xl};
  margin-bottom: ${props => props.theme.spacing['3xl']};

  @media (max-width: ${props => props.theme.breakpoints.md}) {
    grid-template-columns: 1fr;
    gap: ${props => props.theme.spacing.lg};
  }
`;

const AboutSection = styled.div`
  background-color: ${props => props.theme.colors.background};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: ${props => props.theme.spacing.xl};
  box-shadow: ${props => props.theme.shadows.md};
  border: 1px solid ${props => props.theme.colors.border};
  transition: ${props => props.theme.transitions.normal};

  &:hover {
    transform: translateY(-4px);
    box-shadow: ${props => props.theme.shadows.lg};
  }
`;

const SectionIcon = styled.div`
  width: 60px;
  height: 60px;
  border-radius: ${props => props.theme.borderRadius.lg};
  background: linear-gradient(135deg, ${props => props.theme.colors.primary}, ${props => props.theme.colors.secondary});
  color: ${props => props.theme.colors.textInverse};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: ${props => props.theme.spacing.lg};
  font-size: ${props => props.theme.typography.fontSize.xl};
`;

const SectionTitle = styled.h3`
  font-size: ${props => props.theme.typography.fontSize.xl};
  font-weight: ${props => props.theme.typography.fontWeight.semibold};
  color: ${props => props.theme.colors.text};
  margin: 0 0 ${props => props.theme.spacing.md} 0;
`;

const SectionDescription = styled.p`
  font-size: ${props => props.theme.typography.fontSize.base};
  color: ${props => props.theme.colors.textSecondary};
  line-height: 1.7;
  margin: 0;
`;

const TeamSection = styled.div`
  background-color: ${props => props.theme.colors.background};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: ${props => props.theme.spacing.xl};
  box-shadow: ${props => props.theme.shadows.md};
  border: 1px solid ${props => props.theme.colors.border};
  text-align: center;
`;

const TeamTitle = styled.h2`
  font-size: ${props => props.theme.typography.fontSize['2xl']};
  font-weight: ${props => props.theme.typography.fontWeight.bold};
  color: ${props => props.theme.colors.text};
  margin: 0 0 ${props => props.theme.spacing.lg} 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${props => props.theme.spacing.md};
`;

const TeamMembers = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: ${props => props.theme.spacing.lg};
  flex-wrap: wrap;
  margin-top: ${props => props.theme.spacing.lg};
`;

const TeamMember = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  padding: ${props => props.theme.spacing.lg};
  background: linear-gradient(135deg, ${props => props.theme.colors.primary}10, ${props => props.theme.colors.secondary}10);
  border-radius: ${props => props.theme.borderRadius.lg};
  border: 1px solid ${props => props.theme.colors.primary}20;
  transition: ${props => props.theme.transitions.normal};
  min-width: 150px;

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${props => props.theme.shadows.md};
  }
`;

const MemberAvatar = styled.div`
  width: 50px;
  height: 50px;
  border-radius: ${props => props.theme.borderRadius.full};
  background: linear-gradient(135deg, ${props => props.theme.colors.primary}, ${props => props.theme.colors.secondary});
  color: ${props => props.theme.colors.textInverse};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${props => props.theme.typography.fontSize.lg};
  font-weight: ${props => props.theme.typography.fontWeight.bold};
`;

const MemberName = styled.div`
  font-size: ${props => props.theme.typography.fontSize.base};
  font-weight: ${props => props.theme.typography.fontWeight.medium};
  color: ${props => props.theme.colors.text};
  text-align: center;
`;

const About = () => {
  const teamMembers = [
    { name: 'Alan Granados', initials: 'AG' },
    { name: 'Roberto Córdoba', initials: 'RC' },
    { name: 'Kevin Chávez', initials: 'KC' }
  ];

  return (
    <AboutContainer>
      <AboutHeader>
        <AboutTitle>About MindMap</AboutTitle>
        <AboutSubtitle>
          Transformando ideas en mapas mentales visuales e interactivos
        </AboutSubtitle>
      </AboutHeader>

      <AboutContent>
        <AboutSection>
          <SectionIcon>
            <FiTarget />
          </SectionIcon>
          <SectionTitle>Nuestra Misión</SectionTitle>
          <SectionDescription>
            Creemos que las mejores ideas nacen cuando pueden ser visualizadas y organizadas de manera clara. 
            MindMap es una plataforma diseñada para ayudarte a transformar tus pensamientos complejos en 
            mapas mentales intuitivos y colaborativos.
          </SectionDescription>
        </AboutSection>

        <AboutSection>
          <SectionIcon>
            <FiZap />
          </SectionIcon>
          <SectionTitle>Innovación en Acción</SectionTitle>
          <SectionDescription>
            Utilizamos las últimas tecnologías web para ofrecer una experiencia fluida y responsiva. 
            Nuestra plataforma combina la simplicidad de uso con potentes herramientas de colaboración 
            en tiempo real.
          </SectionDescription>
        </AboutSection>

        <AboutSection>
          <SectionIcon>
            <FiUsers />
          </SectionIcon>
          <SectionTitle>Colaboración Real</SectionTitle>
          <SectionDescription>
            Trabaja en equipo como nunca antes. Nuestros mapas mentales permiten colaboración en tiempo real, 
            donde múltiples usuarios pueden editar, comentar y construir ideas juntos, sin importar dónde se encuentren.
          </SectionDescription>
        </AboutSection>

        <AboutSection>
          <SectionIcon>
            <FiShield />
          </SectionIcon>
          <SectionTitle>Seguridad y Privacidad</SectionTitle>
          <SectionDescription>
            Tu privacidad es nuestra prioridad. Implementamos las mejores prácticas de seguridad para 
            proteger tus datos y garantizar que tus ideas permanezcan seguras y accesibles solo para ti 
            y las personas que elijas.
          </SectionDescription>
        </AboutSection>
      </AboutContent>

      <TeamSection>
        <TeamTitle>
          <FiUsers />
          Nuestro Equipo
        </TeamTitle>
        <SectionDescription>
          Conoce al talentoso equipo detrás de MindMap, desarrolladores apasionados por crear 
          herramientas que potencien la creatividad y la colaboración.
        </SectionDescription>
        <TeamMembers>
          {teamMembers.map((member, index) => (
            <TeamMember key={index}>
              <MemberAvatar>
                {member.initials}
              </MemberAvatar>
              <MemberName>{member.name}</MemberName>
            </TeamMember>
          ))}
        </TeamMembers>
      </TeamSection>
    </AboutContainer>
  );
};

export default About;
