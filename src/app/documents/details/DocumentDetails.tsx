import React, {memo} from "react"
import {Post, type PostType} from "@/components/post"
import Link from "next/link";
import {NavLink} from "@/shared/ui/link";


const DocumentDetails = ({data}: { data: PostType | undefined }) => null

export default memo(DocumentDetails)
