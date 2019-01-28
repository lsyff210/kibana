/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import styled from 'styled-components';

export const FolderClosedTriangle = styled.span`
  display: inline-block;
  width: 0;
  height: 0;
  margin-right: 4px;
  border: 6px solid transparent;
  border-left: 6px solid grey;
  vertical-align: middle;
`;

export const FolderOpenTriangle = styled(FolderClosedTriangle)`
  margin-top: 3px;
  border-top: 6px solid grey;
  border-left: 6px solid transparent;
`;