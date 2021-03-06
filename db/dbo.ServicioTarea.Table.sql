USE [SISEP_ControlFlota]
GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[ServicioTarea](
	[setaId] [int] IDENTITY(1,1) NOT NULL,
	[setaServId] [int] NULL,
	[setaTareId] [int] NULL,
	[setaFechaAlta] [datetime] NULL,
	[setaBorrado] [bit] NOT NULL,
 CONSTRAINT [PK_ServicioTarea] PRIMARY KEY CLUSTERED 
(
	[setaId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
