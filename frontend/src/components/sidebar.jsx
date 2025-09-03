'use client';

import { Sidebar } from '@rewind-ui/core';
import { RocketLaunchIcon, LifeRingIcon, EnvelopeOpenIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

export default function SidebarLayout({ children }) {
  return (
    <div className="flex min-h-screen">
      <Sidebar className="w-64">
        <Sidebar.Head>
          <Sidebar.Head.Logo>
            <img src="/images/rewind.svg" alt="Rewind-UI" width={48} height={48} />
          </Sidebar.Head.Logo>
          <Sidebar.Head.Title>Rewind-UI</Sidebar.Head.Title>
          <Sidebar.Head.Toggle />
        </Sidebar.Head>

        <Sidebar.Nav>
          <Sidebar.Nav.Section>
            <Sidebar.Nav.Section.Item
              icon={<RocketLaunchIcon className="h-5 w-5" />}
              label="Dashboard"
              as={Link}
              asProps={{ href: '/dashboard' }}
              active
            />
          </Sidebar.Nav.Section>

          <Sidebar.Nav.Section>
            <Sidebar.Nav.Section.Title>Support</Sidebar.Nav.Section.Title>
            <Sidebar.Nav.Section.Item
              icon={<LifeRingIcon className="h-5 w-5" />}
              label="Contact"
              as={Link}
              asProps={{ href: '/contact' }}
            />
            <Sidebar.Nav.Section.Item
              icon={<EnvelopeOpenIcon className="h-5 w-5" />}
              label="Tickets"
              as={Link}
              asProps={{ href: '/tickets' }}
            />
          </Sidebar.Nav.Section>
        </Sidebar.Nav>
      </Sidebar>

      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
