import { useState } from 'react';
import { primitiveColorRows, semanticColorRows } from './data';
import { TokenCategoryNav } from './token-nav';
import { ThemedColorReferenceTable, TokenReferenceTable, TokenSectionTable } from './token-tables';

export function SemanticColorReferenceSection() {
  return <ThemedColorReferenceTable rows={semanticColorRows} />;
}

export function PrimitiveColorReferenceSection() {
  return <TokenReferenceTable rows={primitiveColorRows} />;
}

export function LayoutReferenceSection() {
  return <TokenSectionTable slug='layout' />;
}

export function SpacingReferenceSection() {
  return <TokenSectionTable slug='spacing' />;
}

export function RadiusReferenceSection() {
  return <TokenSectionTable slug='radius' />;
}

export function SizeReferenceSection() {
  return <TokenSectionTable slug='size' />;
}

export function ZStackReferenceSection() {
  return <TokenSectionTable hidePreviewColumn slug='z-stack' />;
}

export function StrokeReferenceSection() {
  return <TokenSectionTable slug='stroke' />;
}

export function MotionReferenceSection() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  return (
    <div className='docs-stack-md'>
      <label className='token-motion-toggle'>
        <input
          checked={prefersReducedMotion}
          onChange={(event) => {
            setPrefersReducedMotion(event.target.checked);
          }}
          type='checkbox'
        />
        Simulate reduced motion
      </label>
      <TokenSectionTable prefersReducedMotion={prefersReducedMotion} slug='motion' />
    </div>
  );
}

export function TypographyReferenceSection() {
  return <TokenSectionTable slug='typography' />;
}

export function TokenReferenceTables() {
  return (
    <div className='docs-stack-lg'>
      <TokenCategoryNav />
      <SemanticColorReferenceSection />
      <PrimitiveColorReferenceSection />
      <LayoutReferenceSection />
      <SpacingReferenceSection />
      <RadiusReferenceSection />
      <SizeReferenceSection />
      <ZStackReferenceSection />
      <StrokeReferenceSection />
      <MotionReferenceSection />
      <TypographyReferenceSection />
    </div>
  );
}
