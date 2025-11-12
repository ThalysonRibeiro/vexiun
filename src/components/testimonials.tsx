"use client";
import { Card, CardContent } from "./ui/card";
import { Marquee, MarqueeContent, MarqueeFade, MarqueeItem } from "./ui/kibo-ui/marquee";
import { TESTIMONIALS } from "@/lib/constants/constants";

export function TestimonialsSectionMultipleRows({ maxRows }: { maxRows: number }) {
  // Função para dividir em chunks
  const chunkArray = <T,>(array: T[], size: number): T[][] => {
    const chunks: T[][] = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  };

  const testimonialsChunks = chunkArray(TESTIMONIALS, TESTIMONIALS.length / maxRows);

  // Limita a quantidade de linhas baseado no maxRows
  const limitedChunks = testimonialsChunks.slice(0, maxRows);

  return (
    <div className="grid grid-cols-1 gap-4 overflow-hidden">
      {limitedChunks.map((chunk, chunkIndex) => (
        <Marquee key={chunkIndex}>
          <MarqueeFade side="left" />
          <MarqueeFade side="right" />
          <MarqueeContent>
            {chunk.map((item) => (
              <MarqueeItem key={item.author} className="w-100">
                <Card className="rounded-none bg-background/50 opacity-60 hover:opacity-100 transition-opacity border border-border">
                  <CardContent>
                    <p className="italic mb-4">&ldquo;{item.quote}&rdquo;</p>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                        <span className="font-semibold text-primary">{item.initials}</span>
                      </div>
                      <div>
                        <p className="font-medium">{item.author}</p>
                        <p className="text-sm text-muted-foreground">{item.role}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </MarqueeItem>
            ))}
          </MarqueeContent>
        </Marquee>
      ))}
    </div>
  );
}
