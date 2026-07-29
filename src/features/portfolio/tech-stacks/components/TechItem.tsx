'use client';

import { FaAws, FaDatabase, FaGoogle, FaJava, FaServer, FaSlack } from 'react-icons/fa';
import {
  SiAngular,
  SiApache,
  SiApachekafka,
  SiApollographql,
  SiC,
  SiCplusplus,
  SiCypress,
  SiDart,
  SiDjango,
  SiDocker,
  SiDotnet,
  SiElasticsearch,
  SiEslint,
  SiExpress,
  SiFastapi,
  SiFigma,
  SiFirebase,
  SiFlutter,
  SiGit,
  SiGithub,
  SiGithubactions,
  SiGo,
  SiGraphql,
  SiHtml5,
  SiJavascript,
  SiJest,
  SiJira,
  SiKotlin,
  SiKubernetes,
  SiLaravel,
  SiLinux,
  SiMariadb,
  SiMongodb,
  SiMysql,
  SiNestjs,
  SiNextdotjs,
  SiNginx,
  SiNodedotjs,
  SiNotion,
  SiPhp,
  SiPostgresql,
  SiPrettier,
  SiPrisma,
  SiPython,
  SiRabbitmq,
  SiReact,
  SiRedis,
  SiRuby,
  SiRust,
  SiSpring,
  SiSpringboot,
  SiSqlite,
  SiStorybook,
  SiSupabase,
  SiSvelte,
  SiSwift,
  SiTailwindcss,
  SiTypescript,
  SiUbuntu,
  SiVercel,
  SiVite,
  SiVuedotjs,
  SiWebpack,
} from 'react-icons/si';

import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

import { TechItem as TechItemType } from '../types';

// DB에 저장된 이름(React, Next.js 등)을 소문자와 숫자만 남겨 정규화한 키로 매핑
// 예: "Next.js" -> "nextjs", "Node.js" -> "nodejs", "AWS" -> "aws"
const iconMap: Record<string, React.ElementType> = {
  react: SiReact,
  nextjs: SiNextdotjs,
  typescript: SiTypescript,
  javascript: SiJavascript,
  tailwindcss: SiTailwindcss,
  html: SiHtml5,
  html5: SiHtml5,
  nodejs: SiNodedotjs,
  express: SiExpress,
  nestjs: SiNestjs,
  python: SiPython,
  django: SiDjango,
  fastapi: SiFastapi,
  postgresql: SiPostgresql,
  mysql: SiMysql,
  mongodb: SiMongodb,
  redis: SiRedis,
  docker: SiDocker,
  kubernetes: SiKubernetes,
  githubactions: SiGithubactions,
  vercel: SiVercel,
  figma: SiFigma,
  git: SiGit,
  github: SiGithub,
  supabase: SiSupabase,

  // 백엔드 & 언어
  java: FaJava,
  spring: SiSpring,
  springboot: SiSpringboot,
  c: SiC,
  cplusplus: SiCplusplus,
  cpp: SiCplusplus,
  dotnet: SiDotnet,
  go: SiGo,
  golang: SiGo,
  rust: SiRust,
  ruby: SiRuby,
  php: SiPhp,
  laravel: SiLaravel,
  swift: SiSwift,
  kotlin: SiKotlin,

  // 프론트엔드 & 모바일
  dart: SiDart,
  flutter: SiFlutter,
  vue: SiVuedotjs,
  vuejs: SiVuedotjs,
  angular: SiAngular,
  svelte: SiSvelte,
  graphql: SiGraphql,
  apollo: SiApollographql,

  // DB & 인프라
  prisma: SiPrisma,
  linux: SiLinux,
  ubuntu: SiUbuntu,
  nginx: SiNginx,
  apache: SiApache,
  firebase: SiFirebase,
  sqlite: SiSqlite,
  mariadb: SiMariadb,
  oracle: FaDatabase,
  elasticsearch: SiElasticsearch,
  rabbitmq: SiRabbitmq,
  kafka: SiApachekafka,

  // 테스팅 & 도구
  jest: SiJest,
  cypress: SiCypress,
  storybook: SiStorybook,
  webpack: SiWebpack,
  vite: SiVite,
  eslint: SiEslint,
  prettier: SiPrettier,
  jira: SiJira,
  slack: FaSlack,
  notion: SiNotion,

  // 폴백/추가 아이콘들
  aws: FaAws,
  amazonaws: FaAws,
  amazonwebservices: FaAws,

  google: FaGoogle,
  googlecloud: FaGoogle,
  gcp: FaGoogle,

  database: FaDatabase,
  server: FaServer,
};

interface TechItemProps {
  tech: TechItemType;
  isFilteredOut: boolean;
}

const TechItem = ({ tech, isFilteredOut }: TechItemProps) => {
  const normalize = (name: string) => name.toLowerCase().replace(/[^a-z0-9]/g, '');

  const searchKey = tech.icon ? normalize(tech.icon) : normalize(tech.name);
  const IconComponent = iconMap[searchKey] || null;

  return (
    <li className="list-none">
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            tabIndex={0}
            role="button"
            aria-label={`${tech.name}${tech.level ? ` (숙련도: ${tech.level})` : ''}`}
            aria-disabled={isFilteredOut}
            className={cn(
              'focus-visible:ring-brand-primary flex h-14 w-14 items-center justify-center rounded-2xl shadow-sm transition-all duration-300 outline-none focus-visible:ring-2 focus-visible:ring-offset-2 sm:h-16 sm:w-16 md:h-20 md:w-20',
              isFilteredOut
                ? 'pointer-events-none scale-95 opacity-30 blur-sm grayscale'
                : 'cursor-pointer hover:-translate-y-1 hover:shadow-md',
            )}
            style={{ backgroundColor: tech.color ? tech.color : 'var(--brand-secondary)' }}
          >
            {IconComponent ? (
              <IconComponent
                className="text-brand-neutral-light text-2xl sm:text-3xl md:text-4xl"
                aria-hidden="true"
              />
            ) : (
              <span
                className="text-brand-neutral-light font-mono text-lg font-bold sm:text-xl md:text-3xl"
                aria-hidden="true"
              >
                {tech.icon ? tech.icon.substring(0, 2) : tech.name.substring(0, 2)}
              </span>
            )}
          </div>
        </TooltipTrigger>
        <TooltipContent
          side="top"
          className="bg-brand-neutral-dark fill-brand-neutral-dark flex flex-col items-center font-mono transition-all duration-300"
        >
          <p className="text-brand-neutral-light font-bold" aria-hidden="true">
            {tech.name}
          </p>
          {tech.level && (
            <p className="text-brand-neutral-light text-[10px] opacity-80" aria-hidden="true">
              {tech.level}
            </p>
          )}
        </TooltipContent>
      </Tooltip>
    </li>
  );
};

export default TechItem;
