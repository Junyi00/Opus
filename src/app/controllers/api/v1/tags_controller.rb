class Api::V1::TagsController < ApplicationController
		
	def index
		tags = Tag.all
		tags = tags.group(:name, :color).order(count: :desc).count if params[:count].present?

		render json: tags
	end

	def show
		tag = Tag.find_by(id: params[:id])

		render json: tag
	end

	def create
		tag = Tag.new(tag_params)
		if tag.save
			render json: tag
		else
			render json: { error: tag.errors.messages }, status: 422
		end
	end

	def update
		tag = Tag.find_by(id: params[:id])
		if tag.update(tag_params)
			render json: tag
		else
			render json: { error: tag.errors.messages }, status: 422
		end
	end

	def destroy
		tag = Tag.find_by(id: params[:id])
		if tag.destroy
		head :no_content
		else
		render json: { errors: tag.errors }, status: 422
		end
	end
	
	private

	def tag_params
		params.require(:tag).permit(:name, :color, :task_id)
	end

end