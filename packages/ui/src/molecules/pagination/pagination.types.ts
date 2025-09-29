export interface PaginationProps extends React.ComponentProps<"nav"> {}

export interface PaginationContentProps extends React.ComponentProps<"ul"> {}

export interface PaginationItemProps extends React.ComponentProps<"li"> {}

export interface PaginationLinkProps extends React.ComponentProps<"a"> {
  isActive?: boolean
  size?: "default" | "icon"
}

export interface PaginationPreviousProps extends React.ComponentProps<"a"> {}

export interface PaginationNextProps extends React.ComponentProps<"a"> {}

export interface PaginationEllipsisProps extends React.ComponentProps<"span"> {}