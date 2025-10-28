"use client"

import { memo } from "react";

interface TitleGroupProps {
  groupId: string;
  textColor: string;
  title: string;
  onEditGroup: (groupId: string) => void;
}
export const TitleGroup = memo(function TitleGroup({
  groupId,
  textColor,
  title,
  onEditGroup,
}: TitleGroupProps) {
  return (
    <h3
      className="font-bold cursor-pointer hover:opacity-80 transition-opacity"
      style={{ color: textColor }}
      onClick={() => onEditGroup(groupId)}
      title="Clique para editar"
    >
      <span className="capitalize">
        {title[0]}
      </span>
      {title.slice(1)}
    </h3>
  )
});